export interface GitHubProfile {
  login: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
}

export interface RepoData {
  id: number;
  name: string;
  html_url: string;
  stargazers_count: number;
  language: string | null;
}

export interface TransformedData {
  profile: GitHubProfile;
  topRepos: RepoData[];
  languagesData: { name: string; count: number }[];
}

export const fetchGitHubData = async (username: string): Promise<TransformedData> => {
  const cacheKey = `github_data_${username.toLowerCase()}`;
  const cachedData = sessionStorage.getItem(cacheKey);

  // 1. CACHÉ: Verificamos si ya tenemos los datos guardados
  if (cachedData) {
    console.log("Cargando desde caché...");
    return JSON.parse(cachedData);
  }

  console.log("Consumiendo API de GitHub...");
  
  // 2. EXTRACCIÓN (Extract): Peticiones concurrentes a la API
  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
  ]);

  if (!userRes.ok || !reposRes.ok) {
    throw new Error("Usuario no encontrado o error en la API");
  }

  const profile: GitHubProfile = await userRes.json();
  const repos: RepoData[] = await reposRes.json();

  // 3. TRANSFORMACIÓN (Transform & Load - ETL): 
  // Filtramos los 5 repositorios con más estrellas
  const topRepos = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5);

  // Agrupamos y contamos los lenguajes de programación usados
  const languageCounts: Record<string, number> = {};
  repos.forEach((repo) => {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  });

  const languagesData = Object.entries(languageCounts).map(([name, count]) => ({
    name,
    count
  }));

  const finalData: TransformedData = { profile, topRepos, languagesData };

  // Guardamos en caché para futuras búsquedas
  sessionStorage.setItem(cacheKey, JSON.stringify(finalData));

  return finalData;
};