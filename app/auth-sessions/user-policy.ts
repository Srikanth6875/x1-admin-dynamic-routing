
const permissionCache = new Map<string, Map<string, Set<string>>>();
export function getCachedPermissions(sessionId: string) {
    return permissionCache.get(sessionId);
}

export function setCachedPermissions(sessionId: string, permissions: Map<string, Set<string>>) {
    permissionCache.set(sessionId, permissions);
}

export function clearCachedPermissions(sessionId: string) {
    permissionCache.delete(sessionId);
}

export function filterUserCanRBAC(render: any, permissions: Map<string, Set<string>>) {
    render.payload.table_header.actions = render.payload.table_header.actions?.filter((a: any) =>
        canHave(permissions, a.appType, a.runType)) ?? [];

    render.payload.row_actions = render.payload.row_actions?.filter((a: any) =>
        canHave(permissions, a.appType, a.runType)) ?? [];

    return render;
}

export function canHave(permissions: Map<string, Set<string>> | undefined, appType: string, runType?: string): boolean {
    if (!permissions || !appType) return false;
    if (!permissions.has(appType)) return false;
    if (!runType) return true;
    return permissions.get(appType)!.has(runType);
}