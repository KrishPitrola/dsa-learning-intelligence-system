export type SubConceptMastery =
	| {
		  status: "Evaluated";
		  mastery_score: number;
		  accuracy: number;
		  difficulty_weighted_accuracy: number;
		  time_score: number;
		  consistency_score: number;
		  total_attempts: number;
	  }
	| {
		  status: "Insufficient Data";
		  mastery_score: null;
	  };

export type ConceptMastery =
	| {
		  status: "Evaluated";
		  mastery_score: number;
	  }
	| {
		  status: "Not Attempted";
	  };

export type WeakArea = {
	sub_concept: string;
	mastery_score: number;
	status: "Critical" | "Weak" | "Moderate" | "Strong";
};

export type RecommendationQuestion = {
	question_id: string;
	title: string;
	options: string[];
	correct_option: string;
	concept: string;
	sub_concept: string;
	difficulty: number;
	expected_time: number;
};

export type Recommendation = {
	sub_concept: string;
	easy: RecommendationQuestion[];
	medium: RecommendationQuestion[];
	hard: RecommendationQuestion[];
	resource_link: string;
};

export type AnalyticsResponse = {
	overall_mastery: number;
	concept_mastery: Record<string, ConceptMastery>;
	subconcept_mastery: Record<string, SubConceptMastery>;
	weak_areas: WeakArea[];
	recommendations: Recommendation[];
};
