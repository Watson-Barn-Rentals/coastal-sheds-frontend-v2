export const TESTIMONIALS_SECTION_BLOCK_TYPE = "testimonials-section" as const;

type Testimonial = {
  authorsName: string;
  date?: string;
  text: string;
  source: string;
  starRating: number;
}

export type TestimonialsSectionBlockData = {
  heading: string;
  averageRating: number;
  totalReviewsCount: number;
  testimonials: Testimonial[];
};

export type TestimonialsSectionBlock = {
  type: typeof TESTIMONIALS_SECTION_BLOCK_TYPE;
  spaceAfter: string
  data: TestimonialsSectionBlockData;
};

export function isTestimonialsSectionBlock(x: any): x is TestimonialsSectionBlock {
  return (
    x !== null &&
    typeof x === "object" &&
    x.type === TESTIMONIALS_SECTION_BLOCK_TYPE &&
    typeof x.spaceAfter === "string" &&
    typeof x.data === "object" &&
    Array.isArray(x.data.testimonials) &&
    x.data.testimonials.every((testimonial: any) =>
      typeof testimonial === "object" &&
      typeof testimonial.authorsName === "string" &&
      typeof testimonial.date === "string" &&
      typeof testimonial.text === "string" &&
      typeof testimonial.source === "string" &&
      typeof testimonial.starRating === "string"
    ) &&
    typeof x.data.heading === "string" &&
    typeof x.data.averageRating === "string" &&
    typeof x.data.totalReviewsCount === "string"
  );
}
