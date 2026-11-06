# ANES issue items: timed survey task (jsPsych)

A short browser task that asks the 13 ANES 2024 issue questions plus the 4 racial-resentment items used in Mia's `issue_constraint.py`. Each question gets a time limit. Clicking an answer moves straight to the next screen. If time runs out, the task shows "Moving on…" and continues.

## Files
- `index.html`: the experiment. Edit the `CONFIG` block at the top.
- `items.js`: the question bank (wording, endpoint labels, ANES variable IDs).

## How the questions are asked
| Type | Items | What the participant sees | Stored as |
|---|---|---|---|
| 7-point scale | Services, Defense, Jobs, Insur, Aid_to_Black, Enviro, Abortion | ANES stem, buttons 1–7 with labelled ends, plus "Haven't thought much" | 1–7, or 99 |
| Two-step favor/oppose | Guns, Affirm_Act, Trans_Bath, Trans_Sports | (1) Favor / Oppose / Neither → (2) a great deal / moderate / a little | 1–7 summary (the `…x` variable) |
| Two-step increase/decrease | Immigration | (1) Increased / Decreased / Kept the same → (2) a lot / a little | 1–5 summary (V241269x) |
| 5-point | Climate, 4 racial-resentment items | 5 labelled buttons | 1–5 |

Two-step coding follows ANES: 1 = favor a great deal … 4 = neither … 7 = oppose a great deal. "Neither" skips the second step. A timeout on either step leaves that variable blank. ANES randomizes the response order of the two-step items, and so does this task: each participant is randomly given forward or reversed order, recorded in `response_order`.

At the end, the task asks the untimed liberal–conservative self-placement (V241177), so you can split participants the same way Mia does (≤2 / 4 / ≥6).

## Output
Long format: one row per screen, with `item_id`, `anes_var`, `step`, `code`, `rt`, `timed_out`, `time_limit_ms` and `option_order`. The final row (`task == "summary"`) is wide. It has one column per ANES variable (V241239, V242328x, …) in ANES's original coding, plus `racial_resentment` (computed as in Mia's script), `V241177`, `n_timeouts` and `attention_pass`. That row can go straight into Mia's pipeline, which applies her reverse-coding and drops the 99s.

## Timing
Time limit = `BASE_MS + PER_WORD_MS × words on screen`, capped at `MAX_MS`. The defaults are 4 s + 0.2 s/word, which gives about 8 s for "Do you favor that a great deal…?" and about 26 s for the long 7-point stems. For one fixed limit on every screen, set `PER_WORD_MS: 0`.

## Fielding on Prolific
1. Host the folder somewhere public, such as GitHub Pages, cognition.run or Pavlovia.
2. Create a DataPipe experiment at pipe.jspsych.org, linked to an OSF component, and paste its ID into `DATAPIPE_EXPERIMENT_ID`. If this is left blank, the task downloads a CSV locally, which only suits testing.
3. Set `PROLIFIC_COMPLETION_CODE`.
4. Study URL on Prolific: `https://…/index.html?PROLIFIC_PID={{%PROLIFIC_PID%}}&STUDY_ID={{%STUDY_ID%}}&SESSION_ID={{%SESSION_ID%}}`

To test it yourself, open `index.html?debug=1`. The data table appears at the end instead of the redirect.

## Before fielding
Check every stem against the 2024 codebook in the lab Drive (`anes_timeseries_2024_userguidecodebook_20260519.pdf`). Abortion needs the closest look, because its stem was reconstructed from the scale endpoints.
