export interface BookNode{
  level: string;
  category: string;
  book: string;
  volume: string;
  section: string;
  name: string;
  url: string;
  description: string;
  
  author: string;
  imageurl: string;
  volumes: Node[];  
}