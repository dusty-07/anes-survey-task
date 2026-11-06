/* =====================================================================
   ANES 2024 issue items — question bank
   ---------------------------------------------------------------------
   Each item maps to one variable in Mia's issue_constraint.py.
   Codes match the ANES 2024 codebook coding (BEFORE Mia's reverse-coding),
   so the output can be dropped straight into her cleaning pipeline:
     - 99 = "Haven't thought much about this" (she drops these)
     - null = no response within the time limit (timeout)

   Item types
     "scale7"   : one-screen 1–7 placement (labelled endpoints)
     "branch"   : ANES two-step favor/oppose → strength; combined into the
                  1–7 summary (the "x" variables, e.g. V241372x)
     "branch5"  : ANES two-step increase/decrease → a lot/a little;
                  combined into the 1–5 summary (V241269x)
     "likert5"  : one-screen 5-point item

   NOTE: wording follows the ANES 2024 questionnaire as closely as we
   could reconstruct it. Before fielding, check every stem against the
   official codebook in the lab Drive
   (anes_timeseries_2024_userguidecodebook_20260519.pdf) — especially
   Abortion, which is new-format in 2024.
   ===================================================================== */

const SCALE_TAIL =
  "And, of course, some other people have opinions somewhere in between, " +
  "at points 2, 3, 4, 5, or 6. Where would you place yourself on this scale, " +
  "or haven't you thought much about this?";

const FAVOR_OPPOSE_STEM_2 = (dir) =>
  dir === "favor"
    ? "Do you favor that a great deal, a moderate amount, or a little?"
    : "Do you oppose that a great deal, a moderate amount, or a little?";

const AGREE5 = [
  { label: "Agree strongly", code: 1 },
  { label: "Agree somewhat", code: 2 },
  { label: "Neither agree nor disagree", code: 3 },
  { label: "Disagree somewhat", code: 4 },
  { label: "Disagree strongly", code: 5 },
];

const ANES_ITEMS = [
  /* ----------------------------- economic ----------------------------- */
  {
    id: "Services", anes_var: "V241239", type: "scale7",
    stem:
      "Some people think the government should provide fewer services even in " +
      "areas such as health and education in order to reduce spending. Suppose " +
      "these people are at one end of a scale, at point 1. Other people feel it is " +
      "important for the government to provide many more services even if it means " +
      "an increase in spending. Suppose these people are at the other end, at point 7. " +
      SCALE_TAIL,
    left: "Government should provide many fewer services",
    right: "Government should provide many more services",
  },
  {
    id: "Defense", anes_var: "V241242", type: "scale7",
    stem:
      "Some people believe that we should spend much less money for defense. " +
      "Suppose these people are at one end of a scale, at point 1. Others feel that " +
      "defense spending should be greatly increased. Suppose these people are at the " +
      "other end, at point 7. " + SCALE_TAIL,
    left: "Greatly decrease defense spending",
    right: "Greatly increase defense spending",
  },
  {
    id: "Jobs", anes_var: "V241252", type: "scale7",
    stem:
      "Some people feel the government in Washington should see to it that every " +
      "person has a job and a good standard of living. Suppose these people are at " +
      "one end of a scale, at point 1. Others think the government should just let " +
      "each person get ahead on their own. Suppose these people are at the other end, " +
      "at point 7. " + SCALE_TAIL,
    left: "Government should see to jobs and standard of living",
    right: "Government should let each person get ahead on own",
  },
  {
    id: "Insur", anes_var: "V241245", type: "scale7",
    stem:
      "There is much concern about the rapid rise in medical and hospital costs. " +
      "Some people feel there should be a government insurance plan which would cover " +
      "all medical and hospital expenses for everyone. Suppose these people are at one " +
      "end of a scale, at point 1. Others feel that all medical expenses should be paid " +
      "by individuals through private insurance plans like Blue Cross or other company " +
      "paid plans. Suppose these people are at the other end, at point 7. " + SCALE_TAIL,
    left: "Government insurance plan",
    right: "Private insurance plan",
  },
  {
    id: "Aid_to_Black", anes_var: "V241255", type: "scale7",
    stem:
      "Some people feel that the government in Washington should make every effort " +
      "to improve the social and economic position of Black Americans. Suppose these " +
      "people are at one end of a scale, at point 1. Others feel that the government " +
      "should not make any special effort to help Black Americans because they should " +
      "help themselves. Suppose these people are at the other end, at point 7. " + SCALE_TAIL,
    left: "Government should help Black Americans",
    right: "Black Americans should help themselves",
  },
  {
    id: "Enviro", anes_var: "V241258", type: "scale7",
    stem:
      "Some people think we need much tougher government regulations on business in " +
      "order to protect the environment. Suppose these people are at one end of a " +
      "scale, at point 1. Others think that current regulations to protect the " +
      "environment are already too much of a burden on business. Suppose these people " +
      "are at the other end of the scale, at point 7. " + SCALE_TAIL,
    left: "Tougher regulations on business needed to protect environment",
    right: "Regulations to protect environment already too much a burden on business",
  },

  /* ------------------------------ social ------------------------------ */
  {
    id: "Immigration", anes_var: "V241269x", type: "branch5",
    stem1:
      "Should federal spending on tightening border security to prevent illegal " +
      "immigration be increased, decreased, or kept the same?",
    opts1: [
      { label: "Increased", key: "inc" },
      { label: "Decreased", key: "dec" },
    ],
    middle: { label: "Kept the same", key: "same" },
    stem2: (dir) =>
      dir === "inc" ? "Should it be increased a lot or a little?"
                    : "Should it be decreased a lot or a little?",
    // summary coding: 1 inc a lot, 2 inc a little, 3 same, 4 dec a little, 5 dec a lot
    combine: (d, s) =>
      d === "same" ? 3 : d === "inc" ? (s === "lot" ? 1 : 2) : (s === "lot" ? 5 : 4),
  },
  {
    id: "Abortion", anes_var: "V241248", type: "scale7",
    // CHECK THIS STEM against the 2024 codebook before fielding.
    stem:
      "Some people think abortion should always be permitted by law, without " +
      "restrictions. Suppose these people are at one end of a scale, at point 1. " +
      "Others think abortion should never be permitted by law. Suppose these people " +
      "are at the other end, at point 7. " + SCALE_TAIL,
    left: "Should always be permitted without restrictions",
    right: "Should never be permitted",
  },
  {
    id: "Guns", anes_var: "V242328x", type: "branch",
    stem1:
      "Do you favor, oppose, or neither favor nor oppose requiring background checks " +
      "for gun purchases at gun shows or other private sales?",
  },
  {
    id: "Affirm_Act", anes_var: "V242245x", type: "branch",
    stem1:
      "Do you favor, oppose, or neither favor nor oppose allowing universities to " +
      "increase the number of Black students studying at their schools by considering " +
      "race along with other factors when choosing students?",
  },
  {
    id: "Climate", anes_var: "V242321", type: "likert5",
    stem:
      "How much, if at all, do you think climate change is currently affecting severe " +
      "weather events or temperature patterns in the United States?",
    opts: [
      { label: "Not at all", code: 1 },
      { label: "A little", code: 2 },
      { label: "A moderate amount", code: 3 },
      { label: "A lot", code: 4 },
      { label: "A great deal", code: 5 },
    ],
  },
  {
    id: "Trans_Bath", anes_var: "V241372x", type: "branch",
    stem1:
      "Do you favor, oppose, or neither favor nor oppose allowing transgender people " +
      "to use public bathrooms that match the gender they identify with?",
  },
  {
    id: "Trans_Sports", anes_var: "V241375x", type: "branch",
    stem1:
      "Several states have considered laws that would ban transgender girls from " +
      "participating in K-12 girls' sports. Do you favor, oppose, or neither favor " +
      "nor oppose such a law?",
  },

  /* ---------------- racial resentment (4 items → composite) ------------- */
  {
    id: "RR_workway", anes_var: "V242300", type: "likert5", block: "Racial_Res",
    stem:
      "Irish, Italians, Jewish, and many other minorities overcame prejudice and " +
      "worked their way up. Black Americans should do the same without any special " +
      "favors. Do you agree or disagree with this statement?",
    opts: AGREE5,
  },
  {
    id: "RR_slavery", anes_var: "V242301", type: "likert5", block: "Racial_Res",
    stem:
      "Generations of slavery and discrimination have created conditions that make it " +
      "difficult for Black Americans to work their way out of the lower class. Do you " +
      "agree or disagree with this statement?",
    opts: AGREE5,
  },
  {
    id: "RR_deserve", anes_var: "V242302", type: "likert5", block: "Racial_Res",
    stem:
      "Over the past few years, Black Americans have gotten less than they deserve. " +
      "Do you agree or disagree with this statement?",
    opts: AGREE5,
  },
  {
    id: "RR_tryharder", anes_var: "V242303", type: "likert5", block: "Racial_Res",
    stem:
      "It's really a matter of some people not trying hard enough; if Black Americans " +
      "would only try harder they could be just as well off as white Americans. Do you " +
      "agree or disagree with this statement?",
    opts: AGREE5,
  },
];

/* Ideology self-placement — used to split liberal / moderate / conservative
   exactly like Mia's script (<=2 liberal, ==4 moderate, >=6 conservative).
   Asked once at the end, untimed. */
const IDEOLOGY_ITEM = {
  id: "Ideology", anes_var: "V241177",
  stem:
    "We hear a lot of talk these days about liberals and conservatives. Here is a " +
    "seven-point scale on which the political views that people might hold are " +
    "arranged from extremely liberal to extremely conservative. Where would you place " +
    "yourself on this scale, or haven't you thought much about this?",
  opts: [
    { label: "Extremely liberal", code: 1 },
    { label: "Liberal", code: 2 },
    { label: "Slightly liberal", code: 3 },
    { label: "Moderate; middle of the road", code: 4 },
    { label: "Slightly conservative", code: 5 },
    { label: "Conservative", code: 6 },
    { label: "Extremely conservative", code: 7 },
  ],
};
