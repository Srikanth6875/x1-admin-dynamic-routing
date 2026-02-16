import { inlineEditService } from "~/server/table-actions/inline-edit-upsert.service";

export async function action({ request }: { request: Request }) {
    const payload = (await request.json()) as any;
    await inlineEditService.updateCell(payload);
    
    return JSON.stringify({ success: true });
}
