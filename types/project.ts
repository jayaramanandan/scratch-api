interface Project {
  fields: {
    view_count: number;
    favorite_count: number;
    remixers_count: number;
    creator: Object[];
    title: string;
    isPublished: boolean;
    datetime_created: string;
    thumbnail_url: string;
    visibility: string;
    love_count: number;
    datetime_modified: string;
    uncached_thumbnail_url: string;
    thumbnail: string;
    datetime_shared: string;
    commenters_count: number;
  };
  model: string;
  pk: number;
}

export default Project;
