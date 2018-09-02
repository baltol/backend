export interface IDBRole {
  roleId: number;
  roleName: string;
  createEvents: boolean;
  createSubEvents: boolean;
  createThreads: boolean;
  createOrganizers: boolean;
  createModerators: boolean;
  editOrganizers: boolean;
  editModerators: boolean;
  editEvents: boolean;
  editSubEvents: boolean;
  editThreads: boolean;
  closeEvents: boolean;
  closeSubEvents: boolean;
  closeThreads: boolean;
  deleteOrganizers: boolean;
  deleteModerators: boolean;
  lockThreads: boolean;
  editUsers: boolean;
}