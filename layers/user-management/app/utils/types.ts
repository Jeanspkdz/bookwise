export type UserListStatus = 'all' | UserStatus

export interface UserManagementUser {
  id: User['id']
  name: User['name']
  email: User['email']
  image?: User['image']
  dateJoined: User['createdAt']
  universityId: User['studentCode']
  phoneNumber?: User['phoneNumber']
  address?: User['address']
  status: User['status']
  role: User['role']
}

export interface GetUsersFilters {
  status?: UserListStatus
  role?: UserRole
  search?: string
}

export type ApproveUserPayload = UserManagementUser['id']
export type ApproveUserEventHandler = (userId: ApproveUserPayload) => Promise<void>
export type RejectUserEventHandler = (userId: ApproveUserPayload) => Promise<void>

export type ApproveUserResponse = {
  updatedUser: UserManagementUser
}
