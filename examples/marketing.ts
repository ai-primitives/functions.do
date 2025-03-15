import { AI } from '../package'

const ai = AI({
  // Lean Canvas - Business model on a single page
  createLeanCanvas: {
    problems: ['top 3 problems the business solves'],
    customerSegments: ['target customers and users for the product'],
    uniqueValueProposition: 'clear and compelling message that states why you are different and worth buying',
    solutions: ['outline of the solutions to the identified problems'],
    unfairAdvantage: 'something that cannot be easily copied or bought',
    revenueStreams: ['revenue model, lifetime value, revenue, gross margin'],
    costStructure: ['customer acquisition costs', 'distribution costs', 'hosting', 'people', 'etc.'],
    keyMetrics: ['key activities you measure (acquisition, retention, referrals, etc.)'],
    channels: ['path to customers (inbound, outbound, viral, etc.)'],
    earlyAdopters: 'characteristics of the ideal early adopter',
  },

  // StoryBrand Framework - Clarify your message
  createStoryBrand: {
    hero: {
      persona: 'description of the customer',
      wants: 'what the hero explicitly wants',
      needs: 'what the hero actually needs (may be different from wants)',
    },
    problem: {
      external: 'tangible, visible problem the hero faces',
      internal: 'emotional or psychological problem the hero faces',
      philosophical: 'why this problem is unjust or wrong on a larger scale',
      villain: 'the antagonist or root cause of the problem',
    },
    guide: {
      empathy: "how your brand understands and relates to the hero's struggles",
      authority: 'why your brand is qualified to help the hero',
    },
    plan: {
      process: ['three step plan that makes the solution clear and accessible'],
      agreement: 'commitments or guarantees that reduce customer risk',
    },
    callToAction: {
      direct: 'primary call to action (buy now, schedule appointment, etc.)',
      transitional: 'secondary calls to action for those not ready to buy',
    },
    failureStakes: {
      consequences: ["negative outcomes if the hero doesn't use your solution"],
      opportunity: 'what the hero will miss out on',
    },
    successOutcome: {
      external: 'how the product/service solves the external problem',
      internal: 'how the customer will feel after using the product/service',
      philosophical: 'how the world is better when the customer uses the product/service',
      transformation: 'before and after state of the customer',
    },
    brandScript: 'complete narrative combining all elements into a cohesive story',
  },

  // Waitlist Landing Page - Pre-launch page to capture interest
  createWaitlistPage: {
    headline: 'attention-grabbing headline that clearly states value proposition',
    subheadline: 'supporting statement that adds clarity to the headline',
    productDescription: 'concise explanation of what the product does and its benefits',
    keyFeatures: ['list of main features or benefits'],
    socialProof: ['testimonials, user counts, or other trust indicators'],
    captureForm: 'description of email capture form and call to action',
    incentive: 'what users get for joining the waitlist (early access, discount, etc.)',
    visualElements: 'description of images, videos, or other visual elements',
    faq: [
      {
        question: 'frequently asked question',
        answer: 'clear answer to the question',
      },
    ],
    launchDate: 'expected product launch date or timeline',
    callToAction: 'primary button text and action',
    privacyPolicy: 'brief privacy statement about how emails will be used',
  },

  // Marketing Copy - Generate persuasive marketing text
  createMarketingCopy: {
    productName: 'name of the product or service',
    targetAudience: 'description of the ideal customer',
    valueProposition: 'primary benefit or solution offered',
    toneOfVoice: 'desired tone (professional, casual, humorous, etc.)',
    keyMessages: ['main points to communicate'],
    callToAction: 'desired action for the reader to take',
    copyLength: 'short, medium, or long format',
    copyText: 'complete marketing copy based on inputs',
  },

  // Email Campaign - Design a sequence of marketing emails
  createEmailCampaign: {
    campaignGoal: 'primary objective of the email sequence',
    audienceSegment: 'specific segment of customers being targeted',
    numberOfEmails: 'total emails in the sequence',
    timingBetweenEmails: 'days between each email',
    emails: [
      {
        subject: 'email subject line',
        preheader: 'text that appears after the subject line in inbox',
        bodyContent: 'main content of the email',
        callToAction: 'primary action for the reader to take',
        sendTiming: 'when this email should be sent in the sequence',
      },
    ],
    performanceMetrics: ['key metrics to track for this campaign'],
    abtestElements: ['elements to test across different versions'],
  },
})

// Example product to work with
const productExample = {
  name: 'SaaS Platform',
  audience: 'Small business owners',
}

// Function to create just a lean canvas
const createLeanCanvasExample = async () => {
  console.log('Creating lean canvas...')
  const leanCanvas = await ai.createLeanCanvas({
    problems: ['Small businesses struggle with digital marketing', 'Limited budget for marketing tools', 'Lack of expertise in digital channels'],
    customerSegments: [productExample.audience, 'Freelancers', 'New entrepreneurs'],
  })
  console.log('Lean canvas created:', leanCanvas)
  return leanCanvas
}

// Function to create just a StoryBrand framework
const createStoryBrandExample = async () => {
  console.log('Creating StoryBrand framework...')
  const storyBrand = await ai.createStoryBrand({
    character: {
      hero: productExample.audience,
      wants: 'More customers and business growth',
      needs: 'Simple, effective marketing solutions',
    },
    problem: {
      external: 'Not enough customers or sales',
      internal: 'Feeling overwhelmed and inadequate at marketing',
      philosophical: 'Small businesses deserve the same marketing opportunities as big companies',
      villain: 'Complex, expensive marketing tools designed for enterprises',
    },
  })
  console.log('StoryBrand framework created:', storyBrand)
  return storyBrand
}

// Function to create just a waitlist landing page
const createWaitlistPageExample = async () => {
  console.log('Creating waitlist landing page...')
  const waitlistPage = await ai.createWaitlistPage({
    headline: `${productExample.name}: Marketing Made Simple`,
    productDescription: 'An all-in-one marketing platform designed specifically for small businesses',
  })
  console.log('Waitlist landing page created:', waitlistPage)
  return waitlistPage
}

// // Run the complete marketing strategy creation process
// ai.createMarketingStrategy().then((result: any) => {
//   console.log('Marketing strategy creation completed successfully!', result)
// }).catch((error: any) => {
//   console.error('Error creating marketing strategy:', error)
// })

// Uncomment to run individual examples
// createLeanCanvasExample()
// createStoryBrandExample()
// createWaitlistPageExample()
