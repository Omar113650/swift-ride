-- /*
--   Warnings:

--   - You are about to drop the column `date_of_birth` on the `donors` table. All the data in the column will be lost.
--   - Added the required column `date_of_birth` to the `users` table without a default value. This is not possible if the table is not empty.

-- */
-- -- AlterTable
-- ALTER TABLE `assets` ADD COLUMN `donor_identity_id` CHAR(36) NULL,
--     MODIFY `kind` ENUM('USER_AVATAR', 'CAMPAIGN_THUMBNAIL', 'CAMPAIGN_UPDATE_MEDIA', 'INSTITUTION_REGISTRATION_CERTIFICATE', 'INSTITUTION_COMMERCIAL_LICENSE', 'INSTITUTION_REPRESENTATIVE_ID_PHOTO', 'INSTITUTION_COMMISSIONER_IMAGE', 'INSTITUTION_AUTHORIZATION_LETTER', 'BANK_PROOF_DOCUMENT', 'DONOR_ID_FRONT', 'DONOR_ID_BACK', 'DONOR_ID_SELFIE_WITH_ID') NOT NULL;

-- -- AlterTable
-- ALTER TABLE `donors` DROP COLUMN `date_of_birth`;

-- -- AlterTable
-- ALTER TABLE `users` ADD COLUMN `date_of_birth` DATE NOT NULL,
--     MODIFY `country` TEXT NULL,
--     MODIFY `phone_number` TEXT NULL,
--     MODIFY `notes` TEXT NULL;

-- -- CreateTable
-- CREATE TABLE `donor_identities` (
--     `id` CHAR(36) NOT NULL,
--     `donor_id` CHAR(36) NOT NULL,
--     `full_name_on_id` VARCHAR(150) NOT NULL,
--     `id_number` VARCHAR(64) NULL,
--     `reviewed_at` DATETIME(3) NULL,
--     `rejection_reason` TEXT NULL,
--     `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
--     `updated_at` DATETIME(3) NOT NULL,

--     UNIQUE INDEX `donor_identities_donor_id_key`(`donor_id`),
--     UNIQUE INDEX `donor_identities_id_number_key`(`id_number`),
--     PRIMARY KEY (`id`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- -- CreateIndex
-- CREATE INDEX `assets_donor_identity_id_idx` ON `assets`(`donor_identity_id`);

-- -- CreateIndex
-- CREATE INDEX `assets_donor_identity_id_kind_idx` ON `assets`(`donor_identity_id`, `kind`);

-- -- AddForeignKey
-- ALTER TABLE `donor_identities` ADD CONSTRAINT `donor_identities_donor_id_fkey` FOREIGN KEY (`donor_id`) REFERENCES `donors`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE `assets` ADD CONSTRAINT `assets_donor_identity_id_fkey` FOREIGN KEY (`donor_identity_id`) REFERENCES `donor_identities`(`id`) ON DELETE CASCADE ON UPDATE CAS









































































-- 

























===================================s code ==



















-- generator client {
--   provider        = "prisma-client-js"
--   moduleFormat    = "cjs"
-- }

-- datasource db {
--   provider = "mysql"
-- }

-- enum UserRole {
--   DONOR
--   CAMPAIGN_CREATOR
--   ADMIN
-- }

-- enum CampaignCategory {
--   WATER
--   HEALTH
--   ENVIROMENT
--   FOOD
--   EDUCATION
--   SHELTER
--   ANIMALS
-- }

-- enum VerificationStatus {
--   pending
--   confirmed
--   rejected
-- }

-- enum CampaignStatus {
--   pending
--   confirmed
--   rejected
-- }

-- enum PaymentStatus {
--   pending
  completed
  failed
-- }

-- enum WithdrawalStatus {
--   pending
--   approved
--   paid
--   rejected
-- }

-- enum GeographicScope {
--   local
--   global
-- }

-- enum CreatorType {
--   INDIVIDUAL
--   INSTITUTION
-- }

-- enum StorageProviderName {
--   IMAGE_KIT
-- }

-- enum AssetKind {
--   USER_AVATAR

--   CAMPAIGN_THUMBNAIL
--   CAMPAIGN_UPDATE_MEDIA
  
--   INSTITUTION_REGISTRATION_CERTIFICATE
--   INSTITUTION_COMMERCIAL_LICENSE
--   INSTITUTION_REPRESENTATIVE_ID_PHOTO
--   INSTITUTION_COMMISSIONER_IMAGE
--   INSTITUTION_AUTHORIZATION_LETTER

--   BANK_PROOF_DOCUMENT

--   DONOR_ID_FRONT
--   DONOR_ID_BACK
--   DONOR_ID_SELFIE_WITH_ID

--   CREATOR_ID_FRONT
--   CREATOR_ID_BACK
--   CREATOR_ID_SELFIE_WITH_ID
-- }
-- model User {
--   id                 String             @id @default(uuid()) @db.Char(36)
--   firstName          String             @db.Text
--   lastName           String             @db.Text
--   email              String             @unique
--   password           String             @db.Text
--   dateOfBirth        DateTime?           @map("date_of_birth") @db.Date
--   role               UserRole           @default(DONOR)
--   country            String?             @db.Text
--   phoneNumber        String?             @map("phone_number") @db.Text
--   notes              String?             @db.Text
--   isDeleted          Boolean            @default(false) @map("is_deleted")
--   isVerified         Boolean            @default(false) @map("is_verified")
--   createdAt          DateTime           @default(now()) @map("created_at")
--   updatedAt          DateTime           @updatedAt @map("updated_at")
--   verificationStatus VerificationStatus @default(pending) @map("verification_status")
--   bankAccounts       BankAccount[]      @relation("UserBankAccounts")
--   creatorProfile     CampaignCreator?
--   campaigns          Campaign[]         @relation("CampaignCreator")
--   donations          Donation[]
--   donorProfile       Donor?
--   preferences        UserPreference[]
--   withdrawals        Withdrawal[]
--     campaignLikes CampaignLike[]

--   assets       Asset[] @relation("UserAssets")
--   ownedAssets  Asset[] @relation("AssetOwner")

--   @@map("users")
-- }

-- model UserPreference {
--   id         String           @id @default(uuid())
--   userId     String           @map("user_id")
--   preference CampaignCategory
--   user       User             @relation(fields: [userId], references: [id])

--   @@unique([userId, preference])
--   @@map("user_preferences")
-- }

-- model Campaign {
--   id                 String             @id @default(uuid()) @db.Char(36)
--   creatorId          String             @map("creator_id") @db.Char(36)
--   title              String             @db.Text
--   description        String             @db.Text
--   longDescription        String?         @map("long_description")    @db.Text
--   category           CampaignCategory   @default(WATER)
--   goal               Int
--   startDate          DateTime           @map("start_date") @db.Date
--   endDate            DateTime           @map("end_date") @db.Date
--   motivationMessage  String             @map("motivation_message") @db.Text
--   status             CampaignStatus     @default(pending)
--   createdAt          DateTime           @default(now()) @map("created_at")
--   updatedAt          DateTime           @updatedAt @map("updated_at")
--   isVerified         Boolean            @default(false) @map("is_verified")
--   verificationStatus VerificationStatus @default(pending) @map("verification_status")
--   isActive           Boolean            @default(true) @map("is_active")
--   notes              String?             @db.Text
--   isDeleted          Boolean            @default(false) @map("is_deleted")
--   likes         CampaignLike[]
--   updates            CampaignUpdate[]
--   creator            User               @relation("CampaignCreator", fields: [creatorId], references: [id])
--   donations          Donation[]
--   assets Asset[] @relation("CampaignAssets")

--   @@index([creatorId], map: "campigns_creator_id_fkey")
--   @@map("campigns")
-- }

-- model Donation {
--   id            String        @id @default(uuid()) @db.Char(36)
--   userId        String        @map("user_id") @db.Char(36)
--   campaignId    String        @map("campign_id") @db.Char(36)

--   stars            Int
--   starValueInMinor Int         @default(500) @db.UnsignedInt @map("star_value_in_minor")
--   amountInMinor    Int         @db.UnsignedInt @map("amount_in_minor")
--   currency         String      @default("usd") @db.VarChar(3) @map("currency")

--   stripeCheckoutSessionId String? @unique @db.VarChar(255) @map("stripe_checkout_session_id")
--   stripePaymentIntentId   String? @unique @db.VarChar(255) @map("stripe_payment_intent_id")

--   paymentStatus PaymentStatus @default(pending) @map("payment_status")
--   paidAt        DateTime?     @map("paid_at")
--   failureReason String?       @db.Text @map("failure_reason")

--   createdAt     DateTime      @default(now()) @map("created_at")
--   updatedAt     DateTime      @updatedAt @map("updated_at")

--   campaign      Campaign      @relation(fields: [campaignId], references: [id])
--   user          User          @relation(fields: [userId], references: [id])
--   stripeEvents StripeEvent[] @relation("DonationStripeEvents")

--   @@index([campaignId], map: "donations_campign_id_fkey")
--   @@index([userId], map: "donations_user_id_fkey")
--   @@index([paymentStatus])
--   @@index([campaignId, paymentStatus])

--   @@map("donations")
-- }


-- model CampaignUpdate {
--   id          String   @id @default(uuid()) @db.Char(36)
--   campaignId  String   @map("campign_id") @db.Char(36)
--   title       String   @db.Text
--   description String   @db.Text
--     status             CampaignStatus     @default(pending)
--   createdAt   DateTime @default(now()) @map("created_at")
--   updatedAt   DateTime @updatedAt @map("updated_at")
--   campaign    Campaign @relation(fields: [campaignId], references: [id])
--   assets Asset[] @relation("CampaignUpdateAssets")

--   @@index([campaignId])
--   @@map("campaign_updates")
-- }

-- model Withdrawal {
--   id            String           @id @default(uuid()) @db.Char(36)
--   creatorId     String           @map("creator_id") @db.Char(36)
--   bankAccountId String           @map("bank_account_id") @db.Char(36)

--   starsNumber      Int           @db.UnsignedInt @map("stars_number")
--   platformFeeStars Int           @db.UnsignedInt @map("platform_fee_stars") @default(0)
--   netStars         Int           @db.UnsignedInt @map("net_stars") @default(0)
--   platformFeeRate  Float         @default(0.20) @map("platform_fee_rate")
  
--   amountInMinor    Int?          @db.UnsignedInt @map("transfer_amount_in_minor")
--   currency         String        @default("usd") @db.VarChar(3) @map("currency")

--   stripeTransferId String?       @unique @map("stripe_transfer_id") @db.VarChar(255)

--   status        WithdrawalStatus @default(pending)
--   notes         String?           @db.Text

--   approvedAt    DateTime?        @map("approved_at")
--   paidAt        DateTime?        @map("paid_at")

--   createdAt     DateTime         @default(now()) @map("created_at")
--   updatedAt     DateTime         @updatedAt @map("updated_at")

--   bankAccount   BankAccount      @relation(fields: [bankAccountId], references: [id])
--   creator       User             @relation(fields: [creatorId], references: [id])

--   @@index([creatorId])
--   @@index([bankAccountId])
--   @@index([status])

--   @@map("withdrawals")
-- }


-- model Donor {
--   id                          String          @id @default(uuid()) @db.Char(36)
--   userId                      String          @unique @map("user_id") @db.Char(36)
--   areasOfInterest             String          @map("areas_of_interest") @db.Text
--   preferredCampaignTypes      String          @map("preferred_campaign_types") @db.Text
--   geographicScope             GeographicScope @map("geographic_scope")
--   targetAudience              String          @map("target_audience") @db.Text
--   preferredCampaignSize       Int             @map("preferred_campaign_size")
--   preferredCampaignVisibility String          @map("preferred_campaign_visibility") @db.Text
--   createdAt                   DateTime        @default(now()) @map("created_at")
--   updatedAt                   DateTime        @updatedAt @map("updated_at")

--   user                        User            @relation(fields: [userId], references: [id])
--   identity                    DonorIdentity?

--   @@map("donors")
-- }

-- model DonorIdentity {
--   id              String     @id @default(uuid()) @db.Char(36)
--   donorId          String     @unique @map("donor_id") @db.Char(36)

--   fullNameOnId     String     @map("full_name_on_id") @db.VarChar(150)
--   idNumber         String?    @unique @map("id_number") @db.VarChar(64)

--   reviewedAt       DateTime?  @map("reviewed_at")
--   notes  String?    @map("rejection_reason") @db.Text

--   createdAt        DateTime   @default(now()) @map("created_at")
--   updatedAt        DateTime   @updatedAt @map("updated_at")

--   donor            Donor      @relation(fields: [donorId], references: [id], onDelete: Cascade)
--   assets           Asset[]   @relation("DonorIdentityAssets")

--   @@map("donor_identities")
-- }

-- model CampaignCreator {
--   id                                          String      @id @default(uuid()) @db.Char(36)
--   type                                        CreatorType
--   userId                                      String      @unique @map("user_id") @db.Char(36)
--   institutionName                             String?      @map("institution_name") @db.Text
--   institutionType                             String?      @map("institution_type") @db.Text
--   institutionCountry                          String?      @map("institution_country") @db.Text
--   institutionDateOfEstablishment              DateTime?    @map("institution_date_of_establishment") @db.Date
--   institutionLegalStatus                      String?      @map("institution_legal_status") @db.Text
--   institutionTaxIdentificationNumber          String?      @map("institution_tax_identification_number") @db.Text
--   institutionRegistrationNumber               String?      @map("institution_registration_number") @db.Text
--   institutionRepresentativeName               String?      @map("institution_representative_name") @db.Text
--   institutionRepresentativePosition           String?      @map("institution_representative_position") @db.Text
--   institutionRepresentativeRegistrationNumber String?      @map("institution_representative_registration_number") @db.Text
--   institutionWebsite                          String?      @map("institution_website") @db.Text
--   institutionRepresentativeSocialMedia        String?      @map("institution_representative_social_media") @db.Text
--   createdAt                                   DateTime    @default(now()) @map("created_at")
-- updatedAt DateTime @updatedAt @map("updated_at")
--   user                                        User        @relation(fields: [userId], references: [id])
--   assets Asset[] @relation("CreatorAssets")
--   identity                                    CreatorIdentity?
--   stripeAccountId                             String?     @unique @map("stripe_account_id")
--   @@map("campign_creators")
-- }

-- model CreatorIdentity {
--   id              String     @id @default(uuid()) @db.Char(36)
--   creatorId       String     @unique @map("creator_id") @db.Char(36)

--   fullNameOnId    String     @map("full_name_on_id") @db.VarChar(150)
--   idNumber        String?    @unique @map("id_number") @db.VarChar(64)

--   reviewedAt      DateTime?  @map("reviewed_at")
--   notes           String?    @map("rejection_reason") @db.Text

--   createdAt       DateTime   @default(now()) @map("created_at")
--   updatedAt       DateTime   @updatedAt @map("updated_at")

--   creator         CampaignCreator @relation(fields: [creatorId], references: [id], onDelete: Cascade)
--   assets          Asset[]    @relation("CreatorIdentityAssets")

--   @@map("creator_identities")
-- }

-- model BankAccount {
--   id            String       @id @default(uuid()) @db.Char(36)
--   userId     String          @map("user_id") @db.Char(36)
--   bankName      String       @map("bank_name") @db.Text
--   iban          String       @db.Text
--   isVerified    Boolean      @default(false) @map("is_verified")
--   notes         String       @db.Text
--   createdAt     DateTime     @default(now()) @map("created_at")
--   updatedAt     DateTime     @updatedAt @map("updated_at")
--   creator       User         @relation("UserBankAccounts", fields: [userId], references: [id])
--   withdrawals   Withdrawal[]
--   assets        Asset[]      @relation("BankAccountAssets")

--   @@index([userId])
--   @@map("bank_accounts")
-- }

-- model Asset {
--   id                  String              @id @default(uuid()) @db.Char(36)
--   storageProviderName StorageProviderName @default(IMAGE_KIT) @map("storage_provider_name")
--   fileId              String              @unique @map("file_id")
--   url                 String              @db.Text
--   fileType            String              @map("file_type") @db.Text
--   fileSizeInKB        Int                 @map("file_size_in_kb") @db.UnsignedInt
--   kind                AssetKind
--   ownerId             String              @map("owner_id") @db.Char(36)
--   owner               User                @relation("AssetOwner", fields: [ownerId], references: [id])

--   userId              String?             @map("user_id") @db.Char(36)
--   user                User?               @relation("UserAssets", fields: [userId], references: [id])

--   campaignId          String?             @map("campaign_id") @db.Char(36)
--   campaign            Campaign?           @relation("CampaignAssets", fields: [campaignId], references: [id])

--   campaignUpdateId    String?             @map("campaign_update_id") @db.Char(36)
--   campaignUpdate      CampaignUpdate?     @relation("CampaignUpdateAssets", fields: [campaignUpdateId], references: [id])

--   creatorId           String?             @map("creator_id") @db.Char(36)
--   creator             CampaignCreator?    @relation("CreatorAssets", fields: [creatorId], references: [id])

--   bankAccountId       String?             @map("bank_account_id") @db.Char(36)
--   bankAccount         BankAccount?        @relation("BankAccountAssets", fields: [bankAccountId], references: [id])

--   donorIdentityId     String?             @map("donor_identity_id") @db.Char(36)
--   donorIdentity       DonorIdentity?      @relation("DonorIdentityAssets", fields: [donorIdentityId], references: [id], onDelete: Cascade)

--   creatorIdentityId   String?             @map("creator_identity_id") @db.Char(36)
--   creatorIdentity     CreatorIdentity?    @relation("CreatorIdentityAssets", fields: [creatorIdentityId], references: [id], onDelete: Cascade)

--   createdAt     DateTime     @default(now()) @map("created_at")
--   updatedAt     DateTime     @updatedAt @map("updated_at")
  
--   @@index([ownerId])
--   @@index([userId])
--   @@index([campaignId])
--   @@index([campaignUpdateId])
--   @@index([creatorId])
--   @@index([bankAccountId])
--   @@index([donorIdentityId])
--   @@index([donorIdentityId, kind])
--   @@index([creatorIdentityId])
--   @@index([creatorIdentityId, kind])

--   @@map("assets")
-- }

-- model StripeEvent {
--   id         String   @id @db.VarChar(255)
-- type String @db.VarChar(128) @map("type")
--   donationId String?  @map("donation_id") @db.Char(36)
--   createdAt  DateTime @default(now()) @map("created_at")

--   donation Donation? @relation("DonationStripeEvents", fields: [donationId], references: [id], onDelete: SetNull)

--   @@index([donationId])
--   @@index([createdAt])

--   @@map("stripe_events")
-- }

-- model CampaignLike {
--   userId     String   @db.Char(36)
--   campaignId String   @db.Char(36)

--   createdAt  DateTime @default(now())

--   user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
--   campaign   Campaign @relation(fields: [campaignId], references: [id], onDelete: Cascade)

--   @@id([userId, campaignId])
--   @@index([campaignId])
--   @@index([userId])
-- }