export type Language = 'en' | 'fr' | 'zh-CN' | 'zh-TW';
export const languages: Language[] = ['en', 'fr', 'zh-CN', 'zh-TW'];

export const supportedTimeZone = Intl.supportedValuesOf('timeZone');

export enum InquiryStatus {
  INBOX = 'inbox',
  CLOSED = 'closed',
}

export enum InquiryType {
  SHIPPING = 'Shipping',
  PRODUCT = 'Product / Capabilities',
  BILLING = 'Billing',
  GENERAL = 'General',
}

export enum FileExtension {
  PDF = 'PDF',
  JPG = 'JPG',
  PNG = 'PNG',
}

export enum OrderStatus {
  ALL = 'All',
  SUBMITTED = 'Submitted',
  INPROGRESS = 'In Progress',
  SHIPPED = 'Shipped',
  CANCELLED = 'Cancelled',
  ONHOLD = 'On Hold',
  UPLOADPENDING = 'Upload Pending',
}

export enum OrderType {
  DIGITAL = 'Digital',
  CONVENTIONAL = 'Conventional',
  DESIGN = 'Design',
  EC = 'EC',
}

export enum AnnouncementType {
  ALL = 'All',
  COMMON = 'COMMON',
  UPDATES = 'UPDATES',
  IMPORTANT = 'IMPORTANT',
  SYSTEM = 'SYSTEM',
}

export enum BillingType {
  ALL = 'ALL',
  INVOICE = 'INVOICE',
  STATEMENT = 'STATEMENT', //Monthly
  FREIGHT = 'FREIGHT', //Monthly
  CREDIT = 'CREDIT', //Monthly
  SUMMARY = 'SUMMARY', //Monthly
}

export enum Company {
  VD = 110,
  VBEST = 210,
}

export enum Role {
  MANAGER = 'MANAGER',
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
  CLIENTSERVICE = 'CLIENTSERVICE',
}

export enum RoleType {
  STAFF = 'STAFF',
  CLIENT = 'CLIENT',
}

export enum Scope {
  LAB,
  GROUP,
  ALL,
}

export enum Permission {
  READ,
  WRITE,
  DELETE,
}

export enum Resource {
  INQUIRY = 'INQUIRY',
  ORDER = 'ORDER',
}

export type NextAuthUser = {
  name: string | null;
  email: string | null;
  company: number | null;
};

export type NextAuthUserKeys = keyof NextAuthUser;

export const nextAuthUserKeys: NextAuthUserKeys[] = ['name', 'email', 'company'];

export type TableHeaders<T, CustomFields extends string[] = []> = Partial<
  Record<keyof T | CustomFields[number], { value: string; type?: string }>
>;
