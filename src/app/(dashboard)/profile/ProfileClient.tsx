"use client";

import {
  BriefcaseBusiness,
  Globe,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Twitter,
} from "lucide-react";
import { useState } from "react";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { CurrentPlanCard } from "@/components/profile/CurrentPlanCard";
import { DangerZone } from "@/components/profile/DangerZone";
import { IntegrationsPanel } from "@/components/profile/IntegrationsPanel";
import { PersonalInfoForm } from "@/components/profile/PersonalInfoForm";
import { ProfessionalInfoForm } from "@/components/profile/ProfessionalInfoForm";
import { SecurityPanel } from "@/components/profile/SecurityPanel";

type SidebarMilestone = {
  id: string;
  title: string;
  progress: number;
  state: "active" | "locked" | "done";
};

type ShellProps = {
  workspaceName: string;
  initials: string;
  userName: string;
  nextUpTask: string | null;
  nextUpContext: string | null;
  incompleteTaskCount: number;
  rank: number | null;
  milestones: SidebarMilestone[];
  streak: number;
  projectCount: number;
};

type ProfileData = {
  userId: string;
  projectId: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  location: string;
  timezone: string;
  role: string;
  githubUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  websiteUrl: string;
  linkedinUrl: string;
  bio: string;
  startupName: string;
  workspaceName: string;
  workspaceSlug: string;
  notionConnected: boolean;
  createdAt: string;
  streak: number;
  weeklyTasksCompleted: number;
};

type StatsData = {
  inProgress: number;
  completed: number;
  remaining: number;
  bossesDefeated: number;
  weeklyTasks: number;
  leaderboardRank: number | null;
  currentMilestone: string;
  memberSince: string;
};

type ProfileClientProps = {
  shell: ShellProps;
  profile: ProfileData;
  stats: StatsData;
  savePersonalInfo: (payload: Record<string, string>) => Promise<void>;
  saveProfessionalInfo: (payload: Record<string, string>) => Promise<void>;
};

function getSubtitle(profile: ProfileData) {
  return `${profile.role || "Builder"} · ${profile.startupName || profile.workspaceName}`;
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="meta-row">
      <div className="meta-icon">{icon}</div>
      <div className="meta-copy">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <style jsx>{`
        .meta-row {
          display: grid;
          grid-template-columns: 30px minmax(0, 1fr);
          gap: 8px;
          align-items: start;
        }
        .meta-icon {
          width: 30px;
          height: 30px;
          border-radius: 9px;
          display: grid;
          place-items: center;
          border: 1px solid #252538;
          background: #1a1a28;
          color: #8c90a7;
        }
        .meta-copy {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .meta-copy span {
          font-size: 9px;
          color: #5f5f7a;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-family: "Geist Mono", monospace;
        }
        .meta-copy strong {
          font-size: 12px;
          color: #f0f0f8;
          font-weight: 500;
          overflow-wrap: anywhere;
        }
      `}</style>
    </div>
  );
}

export function ProfileClient({
  shell,
  profile,
  stats,
  savePersonalInfo,
  saveProfessionalInfo,
}: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    name: `${profile.firstName} ${profile.lastName}`.trim() || profile.name,
    bio: profile.bio,
    github: profile.githubUrl,
    twitter: profile.twitterUrl,
    instagram: profile.instagramUrl,
    linkedin: profile.linkedinUrl,
    website: profile.websiteUrl,
  });

  const toSocialHref = (value: string, prefix: string) =>
    value.startsWith("http") ? value : `${prefix}${value.replace(/^@/, "")}`;
  const toWebsiteHref = (value: string) => (value.startsWith("http") ? value : `https://${value}`);

  const handleIdentitySave = async () => {
    const nameParts = editValues.name.trim().split(/\s+/);
    const firstName = nameParts[0] ?? "";
    const lastName = nameParts.slice(1).join(" ");

    await savePersonalInfo({
      firstName,
      lastName,
      email: profile.email,
      phone: profile.phone,
      gender: profile.gender,
      dateOfBirth: profile.dateOfBirth,
      location: profile.location,
      timezone: profile.timezone,
    });

    await saveProfessionalInfo({
      projectId: profile.projectId,
      startupName: profile.startupName,
      workspaceName: profile.workspaceName,
      workspaceSlug: profile.workspaceSlug,
      role: profile.role,
      bio: editValues.bio ?? profile.bio,
      twitter: editValues.twitter ?? profile.twitterUrl,
      website: editValues.website ?? profile.websiteUrl,
      linkedin: editValues.linkedin ?? profile.linkedinUrl,
      github: editValues.github ?? profile.githubUrl,
      instagram: editValues.instagram ?? profile.instagramUrl,
    });

    setIsEditing(false);
  };

  const handleIdentityCancel = () => {
    setEditValues({
      name: `${profile.firstName} ${profile.lastName}`.trim() || profile.name,
      bio: profile.bio,
      github: profile.githubUrl,
      twitter: profile.twitterUrl,
      instagram: profile.instagramUrl,
      linkedin: profile.linkedinUrl,
      website: profile.websiteUrl,
    });
    setIsEditing(false);
  };

  return (
    <WorkspaceShell
      workspaceName={shell.workspaceName}
      currentPage="Profile"
      currentSection="/profile"
      initials={shell.initials}
      userName={shell.userName}
      nextUpTask={shell.nextUpTask}
      nextUpContext={shell.nextUpContext}
      incompleteTaskCount={shell.incompleteTaskCount}
      rank={shell.rank}
      milestones={shell.milestones}
      streak={shell.streak}
      projectCount={shell.projectCount}
    >
      <main className="profile-main">
        <div className="profile-grid">
          <aside className="profile-left">
            <section className="card identity-card">
              {isEditing ? (
                <div className="identity-edit">
                  <div className="identity-edit-field">
                    <label>Name</label>
                    <input
                      value={editValues.name}
                      onChange={(event) =>
                        setEditValues((prev) => ({ ...prev, name: event.target.value }))
                      }
                    />
                  </div>
                  <div className="identity-edit-field">
                    <label>Bio</label>
                    <textarea
                      rows={3}
                      value={editValues.bio}
                      onChange={(event) =>
                        setEditValues((prev) => ({ ...prev, bio: event.target.value }))
                      }
                    />
                  </div>
                  <div className="identity-edit-field">
                    <label>GitHub</label>
                    <input
                      value={editValues.github}
                      onChange={(event) =>
                        setEditValues((prev) => ({ ...prev, github: event.target.value }))
                      }
                    />
                  </div>
                  <div className="identity-edit-field">
                    <label>Twitter / X</label>
                    <input
                      value={editValues.twitter}
                      onChange={(event) =>
                        setEditValues((prev) => ({ ...prev, twitter: event.target.value }))
                      }
                    />
                  </div>
                  <div className="identity-edit-field">
                    <label>Instagram</label>
                    <input
                      value={editValues.instagram}
                      onChange={(event) =>
                        setEditValues((prev) => ({ ...prev, instagram: event.target.value }))
                      }
                    />
                  </div>
                  <div className="identity-edit-field">
                    <label>LinkedIn</label>
                    <input
                      value={editValues.linkedin}
                      onChange={(event) =>
                        setEditValues((prev) => ({ ...prev, linkedin: event.target.value }))
                      }
                    />
                  </div>
                  <div className="identity-edit-field">
                    <label>Personal website</label>
                    <input
                      value={editValues.website}
                      onChange={(event) =>
                        setEditValues((prev) => ({ ...prev, website: event.target.value }))
                      }
                    />
                  </div>
                  <div className="identity-edit-actions">
                    <button type="button" className="edit-save-btn" onClick={handleIdentitySave}>
                      Save
                    </button>
                    <button type="button" className="edit-cancel-btn" onClick={handleIdentityCancel}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="avatar-wrap">
                    <div className="avatar-circle">{shell.initials}</div>
                    <button type="button" className="avatar-edit" aria-label="Edit avatar">
                      <Pencil size={12} />
                    </button>
                  </div>

                  <div className="identity-copy">
                    <h1>{profile.name}</h1>
                    <p>{getSubtitle(profile)}</p>
                  </div>

                  <div className="identity-badges">
                    <span className="pill green">{profile.streak} day streak</span>
                    <span className="pill amber">Boss hunter</span>
                    <span className="pill accent">Early builder</span>
                  </div>

                  <div className="meta-list">
                    <MetaRow icon={<Mail size={15} />} label="Email" value={profile.email} />
                    <MetaRow icon={<Phone size={15} />} label="Phone" value={profile.phone || "Not provided"} />
                    <MetaRow icon={<MapPin size={15} />} label="Location" value={profile.location || "Not provided"} />
                    <MetaRow icon={<BriefcaseBusiness size={15} />} label="Role" value={profile.role || "Founder"} />
                    {profile.githubUrl && (
                      <a
                        href={toSocialHref(profile.githubUrl, "https://github.com/")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="meta-link"
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        <MetaRow icon={<Github size={15} />} label="GitHub" value={profile.githubUrl} />
                      </a>
                    )}
                    {profile.twitterUrl && (
                      <a
                        href={toSocialHref(profile.twitterUrl, "https://x.com/")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="meta-link"
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        <MetaRow icon={<Twitter size={15} />} label="Twitter / X" value={profile.twitterUrl} />
                      </a>
                    )}
                    {profile.instagramUrl && (
                      <a
                        href={toSocialHref(profile.instagramUrl, "https://instagram.com/")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="meta-link"
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        <MetaRow icon={<Instagram size={15} />} label="Instagram" value={profile.instagramUrl} />
                      </a>
                    )}
                    {profile.linkedinUrl && (
                      <a
                        href={toSocialHref(profile.linkedinUrl, "https://linkedin.com/in/")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="meta-link"
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        <MetaRow icon={<Linkedin size={15} />} label="LinkedIn" value={profile.linkedinUrl} />
                      </a>
                    )}
                    {profile.websiteUrl && (
                      <a
                        href={toWebsiteHref(profile.websiteUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="meta-link"
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        <MetaRow icon={<Globe size={15} />} label="Website" value={profile.websiteUrl} />
                      </a>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(true);
                      setEditValues({
                        name: `${profile.firstName} ${profile.lastName}`.trim() || profile.name,
                        bio: profile.bio,
                        github: profile.githubUrl,
                        twitter: profile.twitterUrl,
                        instagram: profile.instagramUrl,
                        linkedin: profile.linkedinUrl,
                        website: profile.websiteUrl,
                      });
                    }}
                    style={{
                      width: "100%",
                      padding: "8px",
                      margin: "0",
                      border: "none",
                      borderTop: "1px solid #252538",
                      background: "none",
                      color: "#8c90a7",
                      fontSize: 12,
                      cursor: "pointer",
                      borderRadius: "0 0 12px 12px",
                    }}
                  >
                    Edit profile
                  </button>
                </>
              )}
            </section>

            <section className="card stats-card">
              <div className="stats-grid">
                <div className="stat-box">
                  <span>In Progress</span>
                  <strong className="accent">{stats.inProgress}</strong>
                </div>
                <div className="stat-box">
                  <span>Completed</span>
                  <strong className="green">{stats.completed}</strong>
                </div>
                <div className="stat-box">
                  <span>Remaining</span>
                  <strong>{stats.remaining}</strong>
                </div>
              </div>

              <div className="stats-list">
                <div><span>Bosses defeated</span><strong className="amber">{stats.bossesDefeated}</strong></div>
                <div><span>Weekly tasks</span><strong>{stats.weeklyTasks}</strong></div>
                <div><span>Leaderboard rank</span><strong className="amber">{stats.leaderboardRank ? `#${stats.leaderboardRank}` : "—"}</strong></div>
                <div><span>Current milestone</span><strong>{stats.currentMilestone}</strong></div>
                <div><span>Member since</span><strong>{stats.memberSince}</strong></div>
              </div>
            </section>
          </aside>

          <section className="profile-right">
            <PersonalInfoForm
              values={{
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email,
                phone: profile.phone,
                gender: profile.gender,
                dateOfBirth: profile.dateOfBirth,
                location: profile.location,
                timezone: profile.timezone,
              }}
              onSave={savePersonalInfo}
            />

            <ProfessionalInfoForm
              values={{
                projectId: profile.projectId,
                startupName: profile.startupName,
                role: profile.role,
                workspaceName: profile.workspaceName,
                workspaceSlug: profile.workspaceSlug,
                bio: profile.bio,
                twitter: profile.twitterUrl,
                website: profile.websiteUrl,
                linkedin: profile.linkedinUrl,
              }}
              onSave={saveProfessionalInfo}
            />

            <IntegrationsPanel />
            <SecurityPanel />
            <CurrentPlanCard />
            <DangerZone />
          </section>
        </div>
      </main>

      <style jsx>{`
        .profile-main {
          flex: 1;
          min-width: 0;
          overflow-y: auto;
          background: #0f0f17;
        }
        .profile-grid {
          display: grid;
          grid-template-columns: 380px minmax(0, 1fr);
          gap: 14px;
          align-items: start;
          padding: 14px 18px 18px;
        }
        .profile-left {
          position: sticky;
          top: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-self: start;
        }
        .profile-right {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .card {
          background: #13131e;
          border: 1px solid #252538;
          border-radius: 12px;
        }
        .identity-card {
          padding: 0;
          overflow: hidden;
        }
        .avatar-wrap {
          position: relative;
          width: 72px;
          margin: 20px auto 10px;
        }
        .avatar-circle {
          width: 72px;
          height: 72px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: linear-gradient(180deg, var(--accent) 0%, var(--accent-hover) 100%);
          color: #fff;
          font-size: 16px;
          font-weight: 700;
        }
        .avatar-edit {
          position: absolute;
          right: 2px;
          bottom: 4px;
          width: 22px;
          height: 22px;
          border-radius: 999px;
          border: 1px solid #252538;
          background: #1a1a28;
          color: #c3c6d7;
          display: grid;
          place-items: center;
        }
        .identity-copy h1 {
          margin: 0 0 6px;
          font-size: 15px;
          line-height: 1.1;
          font-weight: 600;
          color: #f0f0f8;
          letter-spacing: -0.02em;
          text-align: center;
        }
        .identity-copy p {
          margin: 0;
          font-size: 10px;
          color: #8c90a7;
          text-align: center;
        }
        .identity-badges {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 5px;
          margin: 10px 14px 14px;
        }
        .pill {
          height: 20px;
          padding: 0 8px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-family: "Geist Mono", monospace;
          border: 1px solid transparent;
        }
        .pill.green {
          color: #22c55e;
          background: rgba(34, 197, 94, 0.08);
          border-color: rgba(34, 197, 94, 0.24);
        }
        .pill.amber {
          color: #ffb700;
          background: rgba(255, 183, 0, 0.08);
          border-color: rgba(255, 183, 0, 0.2);
        }
        .pill.accent {
          color: var(--accent);
          background: var(--accent-subtle);
          border-color: var(--accent-muted);
        }
        .meta-list {
          display: grid;
          border-top: 1px solid #252538;
        }
        .meta-link {
          display: block;
        }
        .meta-link:hover :global(.meta-row) {
          background: rgba(255, 255, 255, 0.02);
        }
        .identity-edit {
          display: grid;
          gap: 10px;
          padding: 14px;
        }
        .identity-edit-field {
          display: grid;
          gap: 6px;
        }
        .identity-edit-field label {
          font-size: 10px;
          color: #8c90a7;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-family: "Geist Mono", monospace;
        }
        .identity-edit-field input,
        .identity-edit-field textarea {
          background: #1a1a28;
          border: 1px solid #252538;
          border-radius: 8px;
          color: #f0f0f8;
          font-size: 13px;
          padding: 9px 10px;
          outline: none;
        }
        .identity-edit-field textarea {
          resize: vertical;
          min-height: 70px;
        }
        .identity-edit-actions {
          display: flex;
          gap: 8px;
          margin-top: 2px;
        }
        .edit-save-btn,
        .edit-cancel-btn {
          flex: 1;
          height: 34px;
          border-radius: 8px;
          border: 1px solid #252538;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
        }
        .edit-save-btn {
          background: var(--accent-subtle);
          color: var(--accent-text);
          border-color: var(--purple-border);
        }
        .edit-cancel-btn {
          background: #1a1a28;
          color: #8c90a7;
        }
        .stats-card {
          padding: 12px;
        }
        :global(.meta-row) {
          padding: 8px 12px;
          border-top: 1px solid #252538;
        }
        :global(.meta-row:first-child) {
          border-top: 0;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 6px;
          margin-bottom: 12px;
        }
        .stat-box {
          border: 1px solid #252538;
          border-radius: 10px;
          background: #1a1a28;
          padding: 8px 4px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          align-items: center;
          justify-content: center;
        }
        .stat-box span {
          font-size: 9px;
          color: #5f5f7a;
          letter-spacing: 0.02em;
        }
        .stat-box strong {
          font-size: 14px;
          color: #f0f0f8;
          font-family: "Geist Mono", monospace;
        }
        .stat-box strong.accent { color: var(--accent); }
        .stat-box strong.green { color: #22c55e; }
        .stats-list {
          display: grid;
          gap: 8px;
        }
        .stats-list div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          padding-top: 6px;
          border-top: 1px solid #252538;
        }
        .stats-list span {
          font-size: 10px;
          color: #8c90a7;
        }
        .stats-list strong {
          font-size: 10px;
          color: #f0f0f8;
          font-family: "Geist Mono", monospace;
          text-align: right;
        }
        .stats-list strong.amber {
          color: #ffb700;
        }
        @media (max-width: 1180px) {
          .profile-grid {
            grid-template-columns: 1fr;
          }
          .profile-left {
            position: static;
          }
        }
      `}</style>
    </WorkspaceShell>
  );
}
