"use client";

import {
  BriefcaseBusiness,
  Github,
  Instagram,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Twitter,
} from "lucide-react";
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
          grid-template-columns: 34px minmax(0, 1fr);
          gap: 10px;
          align-items: start;
        }
        .meta-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
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
          font-size: 10px;
          color: #5f5f7a;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-family: "Geist Mono", monospace;
        }
        .meta-copy strong {
          font-size: 13px;
          color: #f0f0f8;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
    >
      <main className="profile-main">
        <div className="profile-grid">
          <aside className="profile-left">
            <section className="card identity-card">
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
                <MetaRow icon={<Github size={15} />} label="GitHub" value={profile.githubUrl || "@your-github"} />
                <MetaRow icon={<Twitter size={15} />} label="Twitter / X" value={profile.twitterUrl || "@yourhandle"} />
                <MetaRow
                  icon={<Instagram size={15} />}
                  label="Instagram"
                  value="@yourinstagram"
                />
              </div>
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
          grid-template-columns: 268px minmax(0, 1fr);
          gap: 20px;
          align-items: start;
          padding: 20px 24px 28px;
        }
        .profile-left {
          position: sticky;
          top: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-self: start;
        }
        .profile-right {
          display: flex;
          flex-direction: column;
          gap: 20px;
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
          width: 96px;
          margin: 34px auto 16px;
        }
        .avatar-circle {
          width: 96px;
          height: 96px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: linear-gradient(180deg, #8b7fff 0%, #6f60f2 100%);
          color: #fff;
          font-size: 22px;
          font-weight: 700;
        }
        .avatar-edit {
          position: absolute;
          right: 2px;
          bottom: 4px;
          width: 30px;
          height: 30px;
          border-radius: 999px;
          border: 1px solid #252538;
          background: #1a1a28;
          color: #c3c6d7;
          display: grid;
          place-items: center;
        }
        .identity-copy h1 {
          margin: 0 0 6px;
          font-size: 18px;
          line-height: 1.1;
          font-weight: 600;
          color: #f0f0f8;
          letter-spacing: -0.02em;
          text-align: center;
        }
        .identity-copy p {
          margin: 0;
          font-size: 12px;
          color: #8c90a7;
          text-align: center;
        }
        .identity-badges {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          margin: 16px 20px 22px;
        }
        .pill {
          height: 24px;
          padding: 0 10px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
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
          color: #7c6ef7;
          background: rgba(124, 110, 247, 0.08);
          border-color: rgba(124, 110, 247, 0.2);
        }
        .meta-list {
          display: grid;
          border-top: 1px solid #252538;
        }
        .stats-card {
          padding: 18px;
        }
        :global(.meta-row) {
          padding: 12px 18px;
          border-top: 1px solid #252538;
        }
        :global(.meta-row:first-child) {
          border-top: 0;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 18px;
        }
        .stat-box {
          border: 1px solid #252538;
          border-radius: 10px;
          background: #1a1a28;
          padding: 12px 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          align-items: center;
          justify-content: center;
        }
        .stat-box span {
          font-size: 10px;
          color: #5f5f7a;
          letter-spacing: 0.02em;
        }
        .stat-box strong {
          font-size: 18px;
          color: #f0f0f8;
          font-family: "Geist Mono", monospace;
        }
        .stat-box strong.accent { color: #7c6ef7; }
        .stat-box strong.green { color: #22c55e; }
        .stats-list {
          display: grid;
          gap: 12px;
        }
        .stats-list div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          padding-top: 8px;
          border-top: 1px solid #252538;
        }
        .stats-list span {
          font-size: 12px;
          color: #8c90a7;
        }
        .stats-list strong {
          font-size: 12px;
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
