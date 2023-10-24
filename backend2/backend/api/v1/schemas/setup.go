package schemas

type Setup struct {
	Gitlabs []SetupGitlabs `json:"gitlabs"`
}

type SetupGitlabs struct {
	Name        string     `json:"name"`
	Url         string     `json:"url"`
	RedirectUrl string     `json:"redirectUrl"`
	Admin       SetupAdmin `json:"admin"`
}

type SetupAdmin struct {
	Name     string `json:"name"`
	ClientId string `json:"clientId"`
}
