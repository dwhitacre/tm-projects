import type { ApiResponse } from './apiresponse'

export interface Organization {
  organizationId: number
  name: string
  description: string
  image: string
  dateCreated?: Date
  dateModified?: Date
}

export interface OrganizationResponse extends ApiResponse {
  organizations: Organization[]
}
