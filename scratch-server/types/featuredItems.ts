interface FeaturedItem {
  creator: string;
  id: number;
  love_count: number;
  thumbnail_url: string;
  title: string;
  type: string;
}

interface FeaturedItems {
  community_featured_projects: FeaturedItem[];
  community_featured_studios: FeaturedItem[];
  community_most_loved_projects: FeaturedItem[];
  community_most_remixed_projects: FeaturedItem[];
  community_newest_projects: FeaturedItem[];
  curator_top_projects: FeaturedItem[];
  scratch_design_studio: FeaturedItem[];
}

export default FeaturedItems;
