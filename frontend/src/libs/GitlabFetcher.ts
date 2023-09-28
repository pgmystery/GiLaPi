export interface GitlabFetcherErrorData {
  error: string
  error_description: string
}

export interface GitlabFetcherAccessTokenData {
  access_token: string,
  token_type: string,
  expires_in: number,
  refresh_token: string,
  created_at: number
}

export interface GitlabFetcherUserInfo {
  id: number,
  username: string,
  name: string,
  state: string,
  avatar_url: string,
  web_url: string,
  created_at: string,
  bio: string,
  location: string,
  public_email: string | null,
  skype: string,
  linkedin: string,
  twitter: string,
  discord: string,
  website_url: string,
  organization: string,
  job_title: string,
  pronouns: string | null,
  bot: boolean,
  work_information: string | null,
  local_time: string | null,
  last_sign_in_at: string,
  confirmed_at: string,
  last_activity_on: string,
  email: string,
  theme_id: number,
  color_scheme_id: number,
  projects_limit: number,
  current_sign_in_at: string,
  identities: string[],
  can_create_group: boolean,
  can_create_project: boolean,
  two_factor_enabled: boolean,
  external: boolean,
  private_profile: boolean,
  commit_email: string,
  is_admin: boolean,
  note: string | null,
  namespace_id: number,
  created_by: string | null
}

export interface GitlabFetcherProjectInfo {
  id: number
  description: string | null
  name: string
  name_with_namespace: string
  path: string
  path_with_namespace: string
  created_at: string
  default_branch: string
  tag_list: string[]
  topics: string[]
  ssh_url_to_repo: string
  http_url_to_repo: string
  web_url: string
  readme_url: string
  forks_count: number
  avatar_url: string | null
  star_count: number
  last_activity_at: string
  namespace: {
    id: number
    name: string
    path: string
    kind: string
    full_path: string
    parent_id: number
    avatar_url: string | null
    web_url: string
  },
  packages_enabled: boolean
  empty_repo: boolean
  archived: boolean
  visibility: string
  resolve_outdated_diff_discussions: boolean
  container_expiration_policy: {
    cadence: string
    enabled: boolean
    keep_n: number
    older_than: string
    name_regex: string
    name_regex_keep: string | null
    next_run_at: string
  }
  issues_enabled: boolean,
  merge_requests_enabled: boolean,
  wiki_enabled: boolean,
  jobs_enabled: boolean,
  snippets_enabled: boolean,
  container_registry_enabled: boolean,
  service_desk_enabled: boolean,
  service_desk_address: string | null,
  can_create_merge_request_in: boolean,
  issues_access_level: string,
  repository_access_level: string,
  merge_requests_access_level: string,
  forking_access_level: string,
  wiki_access_level: string,
  builds_access_level: string,
  snippets_access_level: string,
  pages_access_level: string,
  analytics_access_level: string,
  container_registry_access_level: string,
  security_and_compliance_access_level: string,
  releases_access_level: string,
  environments_access_level: string,
  feature_flags_access_level: string,
  infrastructure_access_level: string,
  monitor_access_level: string,
  emails_disabled: boolean,
  emails_enabled: boolean,
  shared_runners_enabled: boolean,
  lfs_enabled: boolean,
  creator_id: number,
  import_url: string | null,
  import_type: string | null,
  import_status: string,
  open_issues_count: number,
  description_html: string,
  updated_at: string,
  ci_default_git_depth: number,
  ci_forward_deployment_enabled: boolean,
  ci_forward_deployment_rollback_allowed: boolean,
  ci_job_token_scope_enabled: boolean,
  ci_separated_caches: boolean,
  ci_allow_fork_pipelines_to_run_in_parent_project: boolean,
  build_git_strategy: string,
  keep_latest_artifact: boolean,
  restrict_user_defined_variables: boolean,
  runners_token: string,
  runner_token_expiration_interval: string | null,
  group_runners_enabled: boolean,
  auto_cancel_pending_pipelines: string,
  build_timeout: number,
  auto_devops_enabled: boolean,
  auto_devops_deploy_strategy: string,
  ci_config_path: string | null,
  public_jobs: boolean,
  shared_with_groups: string[],
  only_allow_merge_if_pipeline_succeeds: boolean,
  allow_merge_on_skipped_pipeline: string | null,
  request_access_enabled: boolean,
  only_allow_merge_if_all_discussions_are_resolved: boolean,
  remove_source_branch_after_merge: boolean,
  printing_merge_request_link_enabled: boolean,
  merge_method: string,
  squash_option: string,
  enforce_auth_checks_on_uploads: boolean,
  suggestion_commit_message: string | null,
  merge_commit_template: string | null,
  squash_commit_template: string | null,
  issue_branch_template: string | null,
  autoclose_referenced_issues: boolean,
  repository_storage: string,
  permissions: {
    project_access: string | null,
    group_access: {
      access_level: number,
      notification_level: number
    }
  }
}

export interface GitlabFetcherProjectPipelineInfo {
  id: number,
  iid: number,
  project_id: number,
  status: string,
  source: string,
  ref: string,
  sha: string,
  name: string,
  web_url: string,
  created_at: string,
  updated_at: string
}

type GitlabFetcherFilterType = {[key: string]: string}

interface GitlabFetcherFetchOptions {
  method?: string
  isJSON?: boolean
}

interface GitlabFetcherFetchReturn<T> {
  result: T | GitlabFetcherErrorData,
  response: Response,
}

export class NoAccessTokenException extends Error {}

const defaultFetchOptions: GitlabFetcherFetchOptions = {
  method: 'GET',
  isJSON: true,
}

export default class GitlabFetcher {
  public gitlabURI: string
  public accessToken?: string
  public abortController: AbortController

  constructor(gitlabURI: string, accessToken?: string) {
    this.gitlabURI = gitlabURI
    this.accessToken = accessToken

    this.abortController = this.newAbortController()
  }

  newAbortController() {
    this.abortController = new AbortController()

    return this.abortController
  }

  async requestAccessToken(clientId: string, code: string, redirectURL: string) {
    const url = `${this.gitlabURI}/oauth/token?client_id=${clientId}&code=${code}&grant_type=authorization_code&redirect_uri=${redirectURL}`

    const { result } = await this._fetch<GitlabFetcherAccessTokenData>(url, {
      method: 'POST',
    })

    if ('access_token' in result) {
      this.accessToken = result.access_token
    }

    return result
  }

  async getUserInfo() {
    if (!this.accessToken) {
      throw new NoAccessTokenException('AccessToken is required for this request')
    }

    const url = `${this.gitlabURI}/api/v4/user?access_token=${this.accessToken}`

    const { result } = await this._fetch<GitlabFetcherUserInfo>(url)

    return result
  }

  async getProjects(filter?: GitlabFetcherFilterType) {
    return await this.get<GitlabFetcherProjectInfo[]>('projects', filter)
  }

  async getProjectById(id: number) {
    return await this.get<GitlabFetcherProjectInfo>(`projects/${id}`)
  }

  async getProjectsPipeline(projectId: number) {
    return await this.get<GitlabFetcherProjectPipelineInfo>(`projects/${projectId}/pipelines`)
  }

  async get<T>(resource: string, filter: GitlabFetcherFilterType = {}) {
    if (!this.accessToken) {
      throw new NoAccessTokenException('AccessToken is required for this request')
    }

    let url = `${this.gitlabURI}/api/v4/${resource}?access_token=${this.accessToken}`

    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        if (key && value) {
          url = `${url}&${key}=${value}`
        }
      }
    }

    const { result } = await this._fetch<T>(url)

    return result
  }

  private async _fetch<T>(url: string, options: GitlabFetcherFetchOptions = defaultFetchOptions): Promise<GitlabFetcherFetchReturn<T>> {
    options = {
      ...defaultFetchOptions,
      ...options,
    }
    const { method, isJSON } = options

    const response = await fetch(url, {
      method,
      signal: this.abortController.signal,
    })

    if (isJSON) {
      const result = await response.json()

      return {
        result,
        response,
      }
    }

    const result = await response.text() as T

    return {
      result,
      response,
    }
  }

  getAuthorizeURL(clientId: string, redirectURI: string, scope: string[]) {
    const scopeString = scope.join('+')

    return `${this.gitlabURI}/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectURI}&response_type=code&state=STATE&scope=${scopeString}`
  }
}
