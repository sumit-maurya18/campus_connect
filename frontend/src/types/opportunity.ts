export interface Opportunity {
  id: string;
  title: string;
  type: 'internship' | 'job' | 'hackathon' | 'scholarship' | 'learning';
  source: string;
  redirect_url: string;
  company_organization?: string;
  location?: string;
  deadline?: string;
  posted_date?: string;
  tags?: string[];
  description?: string;
}

export interface OpportunityFilters {
  type?: string;
  location?: string;
  search?: string;
}