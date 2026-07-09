export type UserApprovalStatus = 'all' | 'approved' | 'pending'

export interface UserManagementUser {
  id: User['id']
  name: User['name']
  email: User['email']
  dateJoined: User['createdAt']
  universityId: User['studentCode']
  isApproved: User['isApproved']
  role: User['role']
}

export interface GetUsersFilters {
  approvalStatus?: UserApprovalStatus
  role?: UserRole
  search?: string
}

export type ApproveUserPayload = UserManagementUser['id']
export type ApproveUserEventHandler = (userId: ApproveUserPayload) => Promise<void>

export type ApproveUserResponse = {
  updatedUser: UserManagementUser
}
