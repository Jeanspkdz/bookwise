import { updateAccountStatus } from '~~/layers/user-management/server/utils/update-account-status'

export default defineEventHandler((event) => updateAccountStatus(event, 'approved'))
