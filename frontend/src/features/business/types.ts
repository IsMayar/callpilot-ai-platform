export type Business = {
  id: string;
  name: string;
  industry: string;
  phoneNumber: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
};

export type UpsertBusinessRequest = {
  name: string;
  industry: string;
  phoneNumber: string;
  timezone: string;
};

