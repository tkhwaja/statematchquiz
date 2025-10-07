export interface QuizChoice {
  id: string;
  label: string;
  weights: Record<string, number>;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  choices: QuizChoice[];
}

export interface StateScore {
  state: string;
  city: string;
  score: number;
}

export interface StateMetadata {
  state_code: string;
  state_name: string;
  top_cities: string[];
  highlights: string[];
  politics: string;
  abortion_laws: string;
  gun_laws: string;
  crime_level: string;
  cost_of_living: string;
  healthcare_quality: string;
  climate: string;
  landscape: string;
}

export type AnswerMap = Record<string, string>;

export interface ShareData {
  title: string;
  text: string;
  url: string;
}
