/**
 * serverUser.ts — Server-side helper for reading the current user,
 * their workspace, and team members directly via Prisma.
 *
 * Call from Server Components / Route Handlers only (uses next/headers).
 */

import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";

export interface ServerUser {
  id: string;
  name: string;
  email: string | null;
  role: string;
}

export interface ServerWorkspace {
  id: string;
  name: string;
  industry: string | null;
  country: string | null;
}

export interface ServerTeamMember {
  id: string;           // WorkspaceMember.id
  role: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

export interface ServerContext {
  user: ServerUser;
  workspace: ServerWorkspace | null;
  team: ServerTeamMember[];
}

export async function getServerContext(): Promise<ServerContext | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("futrix_access_token")?.value;
    if (!token) return null;

    const payload = await verifyAccessToken(token);
    if (!payload) return null;

    // Fetch user + primary workspace membership in one query
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        workspaces: {
          select: { workspaceId: true, role: true },
          orderBy: { role: "asc" },
          take: 1,
        },
      },
    });

    if (!user) return null;

    const primaryWorkspaceId = user.workspaces[0]?.workspaceId ?? null;

    let workspace: ServerWorkspace | null = null;
    let team: ServerTeamMember[] = [];

    if (primaryWorkspaceId) {
      const ws = await prisma.workspace.findUnique({
        where: { id: primaryWorkspaceId },
        select: { id: true, name: true, industry: true, country: true },
      });
      workspace = ws;

      const members = await prisma.workspaceMember.findMany({
        where: { workspaceId: primaryWorkspaceId },
        select: {
          id: true,
          role: true,
          user: { select: { id: true, name: true, email: true } },
        },
        take: 20,
      });
      team = members;
    }

    return {
      user: {
        id: user.id,
        name: user.name || user.email?.split("@")[0] || "User",
        email: user.email,
        role: user.role,
      },
      workspace,
      team,
    };
  } catch (err) {
    console.error("getServerContext error:", err);
    return null;
  }
}
