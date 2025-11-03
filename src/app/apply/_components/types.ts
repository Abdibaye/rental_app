export type EligibilityFormState = {
  livesInSF: "yes" | "no" | "";
  householdSize: string;
  monthlyIncome: string;
  assistanceType: "pastDue" | "moving" | "";
  detectedCity: string;
  detectedRegion: string;
  detectedRegionCode: string;
  actualCity: string;
  newApartmentStreet: string;
  newApartmentUnit: string;
  newApartmentCity: string;
  newApartmentState: string;
  newApartmentZip: string;
  newApartmentAddressConfirmation: "yes" | "no" | "";
}

export type AssistanceHistoryState = "yes" | "no" | "";

export type ApplicantInfoFormState = {
  referralSource: "friend" | "community" | "online" | "other" | "";
  referralNote: string;
  assistanceSince2020: AssistanceHistoryState;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  pronouns: string;
  phone: string;
  email: string;
}

export type DemographicsFormState = {
  races: string[];
  decline: boolean;
}

export type AddressFormState = {
  addressLine1: string;
  unit: string;
  city: string;
  zipCode: string;
}

export type HouseholdMember = {
  name: string;
  age: string;
  relationship: string;
}

export type HouseholdFormState = {
  livingSituation: string;
  members: HouseholdMember[];
  hasChanges: "yes" | "no" | "";
  expectingChild: "yes" | "no" | "";
  infants: string;
  children: string;
  teens: string;
  adults: string;
}

export type EmploymentFormState = {
  employed: "yes" | "no" | "";
  employmentType: "fullTime" | "partTime" | "gig" | "selfEmployed" | "businessOwner" | "";
  occupation: string;
  employerName: string;
  selfEmploymentDescription: string;
  previousOccupation: string;
  previousEmployer: string;
}

export type MultiStepFormState = {
  eligibility: EligibilityFormState;
  applicantInfo: ApplicantInfoFormState;
  demographics: DemographicsFormState;
  address: AddressFormState;
  household: HouseholdFormState;
  employment: EmploymentFormState;
}

export type StepKey = keyof MultiStepFormState;

export type StepDefinition = {
  id: StepKey;
  title: string;
  description: string;
};
