
import React from 'react';
import { 
  Lightbulb, 
  Trash, 
  Signpost, 
  Trees, 
  Armchair, 
  Droplet, 
  HardHat, 
  Wifi,
  LucideProps,
  TagsIcon,
} from 'lucide-react';

// Create an interface to define the icon mapping
export interface IconsInterface {
  [key: string]: React.FC<LucideProps>;
}

// Map icon names to Lucide components
export const Icons: IconsInterface = {
  lightbulb: Lightbulb,
  trash: Trash,
  road: Signpost,  // Changed from Road to Signpost
  tree: Trees,     // Changed from Tree to Trees
  bench: Armchair,
  water: Droplet,
  construction: HardHat,
  wifi: Wifi,
  category: TagsIcon,
};

export default Icons;
