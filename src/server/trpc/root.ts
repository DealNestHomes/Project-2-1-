import {
  createCallerFactory,
  createTRPCRouter,
  baseProcedure,
} from "~/server/trpc/main";
import { submitDeal } from "~/server/trpc/procedures/submitDeal";
import { getAddressSuggestions } from "~/server/trpc/procedures/getAddressSuggestions";
import { getPlaceDetails } from "~/server/trpc/procedures/getPlaceDetails";
import { adminLogin } from "~/server/trpc/procedures/adminLogin";
import { listDealSubmissions } from "~/server/trpc/procedures/listDealSubmissions";
import { getDealSubmission } from "~/server/trpc/procedures/getDealSubmission";
import { updateDealStatus } from "~/server/trpc/procedures/updateDealStatus";
import { updateDealDetails } from "~/server/trpc/procedures/updateDealDetails";
import { sendDealToTc } from "~/server/trpc/procedures/sendDealToTc";
import { sendJvAgreement } from "~/server/trpc/procedures/sendJVAgreement";
import { sendDealDescription } from "~/server/trpc/procedures/sendDealDescription";
import { generatePresignedUploadUrl } from "~/server/trpc/procedures/generatePresignedUploadUrl";
import { getMinioBaseUrl } from "~/server/trpc/procedures/getMinioBaseUrl";
import { updateDealDocument } from "~/server/trpc/procedures/updateDealDocument";

export const appRouter = createTRPCRouter({
  submitDeal,
  getAddressSuggestions,
  getPlaceDetails,
  adminLogin,
  listDealSubmissions,
  getDealSubmission,
  updateDealStatus,
  updateDealDetails,
  sendDealToTc,
  sendJvAgreement,
  sendDealDescription,
  generatePresignedUploadUrl,
  getMinioBaseUrl,
  updateDealDocument,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
