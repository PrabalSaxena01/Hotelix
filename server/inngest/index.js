import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";

export const inngest = new Inngest({ id: "hotelix" });

const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk' },
    { event: 'clerk/user.created' },

    async ({ event }) => {
        const { id, email_addresses, first_name, last_name, image_url } = event.data;

        await prisma.user.upsert({
            where: { id },
            update: {
                email: email_addresses?.[0]?.email_address || "",
                username: `${first_name || ""} ${last_name || ""}`.trim() || "User",
                image: image_url || null
            },
            create: {
                id,
                email: email_addresses?.[0]?.email_address || "",
                username: `${first_name || ""} ${last_name || ""}`.trim() || "User",
                image: image_url || null
            }
        });
    }
);

const syncUserDeletion = inngest.createFunction(
    { id: 'delete-user-from-clerk' },
    { event: 'clerk/user.deleted' },

    async ({ event }) => {
        const { id } = event.data;
        await prisma.user.delete({ where: { id } }).catch(() => {});
    }
);

const syncUserUpdation = inngest.createFunction(
    { id: 'update-user-from-clerk' },
    { event: 'clerk/user.updated' },

    async ({ event }) => {
        const { id, email_addresses, first_name, last_name, image_url } = event.data;

        await prisma.user.update({
            where: { id },
            data: {
                email: email_addresses?.[0]?.email_address || "",
                username: `${first_name || ""} ${last_name || ""}`.trim() || "User",
                image: image_url || null
            }
        }).catch(() => {});
    }
);

export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation
];