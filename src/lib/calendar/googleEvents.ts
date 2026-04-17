export type GoogleCalendarEvent = {
  id?: string;
  status?: string;
  summary?: string;
  extendedProperties?: {
    private?: Record<string, string | undefined>;
  };
};

type EventsListResponse = {
  items?: GoogleCalendarEvent[];
  nextPageToken?: string;
  nextSyncToken?: string;
};

export async function getFullSyncToken(accessToken: string) {
  let pageToken: string | undefined;
  let nextSyncToken: string | undefined;

  do {
    const params = new URLSearchParams({
      singleEvents: "true",
      showDeleted: "true",
      maxResults: "2500",
    });
    if (pageToken) params.set("pageToken", pageToken);

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params.toString()}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    if (!response.ok) {
      throw new Error(`Google events full sync failed (${response.status})`);
    }

    const data = (await response.json()) as EventsListResponse;
    pageToken = data.nextPageToken;
    if (!pageToken && data.nextSyncToken) {
      nextSyncToken = data.nextSyncToken;
    }
  } while (pageToken);

  if (!nextSyncToken) {
    throw new Error("Google full sync did not return nextSyncToken");
  }

  return nextSyncToken;
}

export async function listIncrementalEvents(params: {
  accessToken: string;
  syncToken: string;
}) {
  const events: GoogleCalendarEvent[] = [];
  let pageToken: string | undefined;
  let nextSyncToken: string | undefined;

  do {
    const query = new URLSearchParams({
      singleEvents: "true",
      showDeleted: "true",
      syncToken: params.syncToken,
      maxResults: "2500",
    });
    if (pageToken) query.set("pageToken", pageToken);

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?${query.toString()}`,
      {
        headers: { Authorization: `Bearer ${params.accessToken}` },
      },
    );

    if (response.status === 410) {
      return { needsResync: true as const, events: [], nextSyncToken: null };
    }

    if (!response.ok) {
      throw new Error(`Google incremental sync failed (${response.status})`);
    }

    const data = (await response.json()) as EventsListResponse;
    events.push(...(data.items ?? []));
    pageToken = data.nextPageToken;
    if (!pageToken) {
      nextSyncToken = data.nextSyncToken;
    }
  } while (pageToken);

  return {
    needsResync: false as const,
    events,
    nextSyncToken: nextSyncToken ?? params.syncToken,
  };
}
