# ATHENA Substantive Micro-skill Protocols — Batch 04

**Status:** Substantive authored drafts; not independently reviewed, calibrated or certified.

**Scope:** 20 digital-technical and visual-observation/creative protocols.


## MS-05-001 — Use keyboard shortcuts safely

**Target performance:** Use a small, verified set of shortcuts to navigate and edit efficiently without accidental destructive actions.

**Prerequisites and setup:** Choose a familiar app and a disposable practice document. Confirm shortcuts for the current operating system and app; do not assume every app uses identical bindings.

**Acquisition sequence:**

1. Identify three non-destructive navigation shortcuts and two editing shortcuts from the app help or menu. 2. Practise each slowly while observing the result. 3. Use undo immediately after a reversible test edit to verify the undo path. 4. Learn save and search shortcuts separately. 5. Avoid unfamiliar combinations near delete, close, overwrite or system actions until the document is saved. 6. Practise a short sequence: select, copy, paste, undo, save. 7. Check the resulting text and file state rather than assuming the keypress worked.

**Practice dose:** Practise 5–8 minutes in a scratch document; learn no more than five shortcuts in one session.

**Assessment and pass criterion:** Complete a 10-step editing sequence with no unintended data loss and correctly explain how to undo or recover the test change.

**Common failure modes:** Memorising shortcuts without checking app context; using platform-specific keys on another device; repeatedly pressing a shortcut when the app is unresponsive.

**Delayed retention check:** After one week, perform the sequence from memory in the same app and identify one shortcut that differs in another app.

**Transfer task:** Transfer the shortcut-learning method to a second app by consulting its own menus/help and testing only in a scratch file.

**Safety and scope:** Save a copy first. Do not test destructive shortcuts on real work or system settings.

**Evidence to record:** App/version, shortcut list/source, sequence result, errors and recovery steps.

**Status:** Draft authored; independent subject review, learner testing and calibration required.


## MS-05-002 — Search with exact phrases

**Target performance:** Construct a search query that retrieves documents containing a specific phrase while preserving context and avoiding false matches.

**Prerequisites and setup:** Use a public search engine or local document search with a known phrase from a non-sensitive source.

**Acquisition sequence:**

1. Identify the exact phrase and its likely spelling. 2. Put the phrase in quotation marks where the search system supports exact-phrase search. 3. Add one contextual term only if results are too broad. 4. Compare quoted and unquoted result sets. 5. Open candidate results and verify the phrase appears in context. 6. Note whether punctuation, pluralisation or spelling variants affect matching. 7. Record the search engine and date because ranking and syntax vary.

**Practice dose:** Run three small searches using a known phrase, a phrase plus context and a spelling variant.

**Assessment and pass criterion:** Find the known source within the first few relevant results or explain why the engine failed; reject snippets that do not contain the phrase in the page.

**Common failure modes:** Assuming quotation marks guarantee truth; trusting snippets; adding too many terms; overlooking OCR or punctuation variation.

**Delayed retention check:** After several days, locate a different known phrase and verify it in the source document.

**Transfer task:** Apply exact phrase searching to a research task, then use broader terms to discover related terminology without confusing discovery with verification.

**Safety and scope:** Do not search for or expose private credentials or personal data.

**Evidence to record:** Exact query, engine, date, result URL, in-page verification and search limitations.

**Status:** Draft authored; independent subject review, learner testing and calibration required.


## MS-05-003 — Evaluate a source quickly

**Target performance:** Make a preliminary reliability judgement by checking authorship, evidence, date, purpose and corroboration.

**Prerequisites and setup:** Select a public claim on a topic where independent sources exist; avoid high-stakes health/legal decisions for practice.

**Acquisition sequence:**

1. Identify the exact claim being evaluated. 2. Find who created the source and what relevant expertise or institutional role they have. 3. Check publication/update date and whether the claim is time-sensitive. 4. Inspect evidence: primary data, citations, method or direct documentation. 5. Identify purpose and possible conflicts of interest. 6. Search for independent corroboration and credible disagreement. 7. Record a provisional rating with reasons and unresolved questions; do not reduce reliability to website appearance.

**Practice dose:** Evaluate two sources making similar claims and one source disagreeing; spend 5–10 minutes each.

**Assessment and pass criterion:** Correctly identify at least two strengths and two limitations per source and distinguish source quality from whether a single claim is true.

**Common failure modes:** Treating a polished site as trustworthy; rejecting a source solely for unfamiliar branding; confusing popularity with corroboration.

**Delayed retention check:** Re-evaluate one claim after a week or when newer evidence appears; note whether the judgement changes.

**Transfer task:** Use the checklist for a product comparison or historical claim and explain why different claim types need different evidence.

**Safety and scope:** For medical, legal, financial or safety decisions, seek qualified sources and trusted adult/professional guidance; this quick screen is not a final authority.

**Evidence to record:** Claim, author/date, evidence inspected, purpose/conflict, corroborating sources and provisional limitations.

**Status:** Draft authored; independent subject review, learner testing and calibration required.


## MS-05-004 — Capture a reproducible bug report

**Target performance:** Describe a software defect so another person can reproduce it, compare expected and actual behaviour, and isolate relevant conditions.

**Prerequisites and setup:** Use a harmless bug in a test app, demo project or practice page. Never probe systems without permission.

**Acquisition sequence:**

1. Record app name, version, device/OS and relevant environment. 2. Start from a known state and write the shortest sequence of actions that triggers the issue. 3. State expected behaviour and actual behaviour separately. 4. Record frequency and whether the issue is consistent. 5. Capture a screenshot or log with secrets and personal data removed. 6. Note what changed recently if known, without guessing at root cause. 7. Retest from a clean state and confirm the steps still work. 8. Write a concise title and attach evidence.

**Practice dose:** Write one report for a reproducible harmless issue; ask another person to follow the steps if available.

**Assessment and pass criterion:** A second person can reproduce the same outcome using the report, or the report clearly states which step could not be reproduced.

**Common failure modes:** Mixing opinion with observation; omitting environment; vague steps; including passwords/tokens in screenshots; asserting cause without evidence.

**Delayed retention check:** Reopen the report after several days and check whether a new reader can reproduce it without verbal explanation.

**Transfer task:** Use the same structure for a website issue and a command-line tool; adjust environment details.

**Safety and scope:** Only test software and accounts you own or have permission to use. Redact credentials, session tokens and private user data.

**Evidence to record:** Environment, exact steps, expected/actual, frequency, evidence and independent reproduction result.

**Status:** Draft authored; independent subject review, learner testing and calibration required.


## MS-05-005 — Use Git status and diff

**Target performance:** Inspect working-tree changes and understand a diff before staging or committing code.

**Prerequisites and setup:** Use a local practice repository with a few text files. Ensure the work is disposable or backed up.

**Acquisition sequence:**

1. Run `git status` and identify branch, staged changes and untracked files. 2. Edit one line in a tracked file and create one new file. 3. Run `git status` again and explain each reported state. 4. Run `git diff` to inspect unstaged tracked changes. 5. Stage only the intended file, then run `git diff --staged`. 6. Check that no secrets, generated junk or unrelated edits are included. 7. Commit only after the staged diff matches the intended change. 8. Run status again and confirm the working tree state.

**Practice dose:** Complete one edit-stage-inspect-commit cycle in a toy repository; do not practise on a production branch.

**Assessment and pass criterion:** Correctly distinguish modified, untracked and staged files; explain every changed line in the staged diff before committing.

**Common failure modes:** Assuming status means code correctness; staging everything blindly; confusing unstaged and staged diffs; committing credentials.

**Delayed retention check:** After a week, inspect a new practice change and explain exactly what a commit would contain before creating it.

**Transfer task:** Transfer to a collaborative branch by reviewing a teammate’s diff and identifying unrelated or risky changes.

**Safety and scope:** Never stage secrets or private keys. Use a practice repository; do not run destructive Git commands on important work without a verified backup.

**Evidence to record:** Command outputs, staged diff, commit identifier, clean/dirty status and review notes.

**Status:** Draft authored; independent subject review, learner testing and calibration required.


## MS-05-006 — Create a strong unique passphrase

**Target performance:** Create and store a unique, hard-to-guess passphrase using a reputable password manager or secure generation method.

**Prerequisites and setup:** Use a password manager appropriate to the account and device; do not disclose any real password during practice.

**Acquisition sequence:**

1. Understand that length and uniqueness matter more than predictable substitutions. 2. Use a password manager’s generator where available, or a well-designed random-word method; do not use quotes, song lyrics or personal facts. 3. Ensure the passphrase is unique to one account. 4. Store it in the password manager rather than notes, chat or screenshots. 5. Enable multifactor authentication where supported, preferably phishing-resistant options when available. 6. Verify recovery methods and secure the manager’s master credential separately. 7. Never send the passphrase to another person or an AI assistant.

**Practice dose:** Practise by generating a dummy passphrase for a mock account; do not create or share actual credentials in the learning record.

**Assessment and pass criterion:** Explain uniqueness, length, manager storage and MFA; demonstrate a mock credential saved and retrieved without exposing it.

**Common failure modes:** Reusing a memorable phrase; adding predictable numbers; storing credentials in plain text; sharing screenshots; confusing a strong password with phishing protection.

**Delayed retention check:** Review account security settings after one month and verify that recovery options remain controlled.

**Transfer task:** Apply the method to a new mock service and explain why a breach of one site should not compromise other accounts.

**Safety and scope:** Never paste real credentials into this chat, documents or practice evidence. Ask a trusted adult for help with account recovery and family-managed accounts.

**Evidence to record:** Use a dummy credential only; record manager features and MFA/recovery checklist, never the secret itself.

**Status:** Draft authored; independent subject review, learner testing and calibration required.


## MS-05-007 — Recognise phishing indicators

**Target performance:** Identify suspicious message patterns and verify requests through a trusted channel without interacting with risky links or attachments.

**Prerequisites and setup:** Use publicly available training examples or screenshots with all live links disabled.

**Acquisition sequence:**

1. Check whether the message was expected and whether the sender identity matches the claimed organisation. 2. Inspect the full sender address or account details where possible. 3. Look for urgency, threats, unusual payment or credential requests, and unexpected attachments. 4. Treat links as untrusted; do not open them to test. 5. Navigate independently using a known official app/site or contact route. 6. Report or delete the message using the platform’s process. 7. If credentials were entered, immediately involve a trusted adult and follow the official account recovery process.

**Practice dose:** Classify 10 training examples; include legitimate messages so the learner does not label every unfamiliar message as phishing.

**Assessment and pass criterion:** Identify the majority of malicious examples and explain verification steps; do not click any live suspicious link.

**Common failure modes:** Relying only on spelling errors; trusting display names; assuming HTTPS proves legitimacy; replying to ask if a message is real.

**Delayed retention check:** After one week, classify a fresh set and explain one sophisticated indicator such as a lookalike domain or compromised legitimate account.

**Transfer task:** Apply to a fake delivery notice and a fake school account alert, verifying through independent official channels.

**Safety and scope:** Do not interact with live suspicious content. Never share codes, passwords or recovery phrases. Ask a trusted adult before acting on unexpected financial or account requests.

**Evidence to record:** Training sample IDs, indicators identified, false positives/negatives and safe verification route.

**Status:** Draft authored; independent subject review, learner testing and calibration required.


## MS-05-008 — Back up a file and verify restore

**Target performance:** Create a second copy of a file and demonstrate that it can be restored and opened correctly.

**Prerequisites and setup:** Use a non-sensitive test file. Choose a second location or medium distinct from the original; understand that sync is not always a backup.

**Acquisition sequence:**

1. Create a small test document and record its filename and approximate size. 2. Copy it to a separate backup location using a clear date/version name. 3. Confirm the copy exists and has plausible size. 4. Safely eject removable storage if applicable. 5. Rename or move the original test file so the backup is the only available copy in the test folder. 6. Restore the backup to a new location. 7. Open it and compare content with the expected original. 8. Record what was tested and what was not (for example, app settings or linked media).

**Practice dose:** Perform one full backup-and-restore drill with a disposable file. Repeat after changing the backup destination.

**Assessment and pass criterion:** Restored file opens and content matches the expected version; learner can describe the difference between copy, sync and backup.

**Common failure modes:** Assuming a successful upload proves restore; backing up to the same failing device; overwriting the only copy; forgetting encryption/recovery keys.

**Delayed retention check:** Repeat a restore test after one month or after changing storage method.

**Transfer task:** Design a simple backup routine for a project folder with at least one separate copy and a documented restore path.

**Safety and scope:** Do not experiment with irreplaceable data. Keep private files encrypted where appropriate and protect backup credentials.

**Evidence to record:** File hash or content comparison, destination, date, restore location, successful open and limitations.

**Status:** Draft authored; independent subject review, learner testing and calibration required.


## MS-05-009 — Use a terminal safely

**Target performance:** Run basic read-only commands, understand the current directory and inspect commands before executing changes.

**Prerequisites and setup:** Use a local sandbox directory with disposable files. Do not run unknown scripts or commands copied from untrusted sources.

**Acquisition sequence:**

1. Open the terminal and identify the current directory with a read-only command. 2. List files and inspect a small text file. 3. Change into the sandbox directory using an explicit path. 4. Create a harmless test directory or file using a known command. 5. Inspect the result before proceeding. 6. Before any command that deletes, overwrites, installs or changes permissions, explain its effect and target. 7. Avoid piping remote downloads directly into a shell. 8. Return to the parent directory and confirm the test files remain where expected.

**Practice dose:** Practise 10 minutes in a sandbox; focus on `pwd`, listing, navigation and reading commands before adding file creation.

**Assessment and pass criterion:** Correctly identify working directory, target path and effect for each command; no unintended changes occur.

**Common failure modes:** Running commands without understanding flags; copying commands with elevated privileges; assuming a command is safe because it is short; deleting recursively.

**Delayed retention check:** After several days, navigate a new sandbox and explain each command before execution.

**Transfer task:** Use the method in Termux or a desktop shell while distinguishing platform-specific command behaviour.

**Safety and scope:** Do not use `sudo`/root or destructive commands for practice. Never execute unknown scripts, malware samples or commands against another person’s device.

**Evidence to record:** Command list, expected effect, actual output, changed files and any recovery action.

**Status:** Draft authored; independent subject review, learner testing and calibration required.


## MS-05-010 — Read a simple JSON object

**Target performance:** Interpret keys, values, arrays, nested objects and basic JSON syntax without confusing text values with numbers or booleans.

**Prerequisites and setup:** Use a short sample JSON file containing fictional data; use a formatter or parser only after first inspecting the text.

**Acquisition sequence:**

1. Identify the outer braces and each key-value pair. 2. Distinguish strings in quotes, numbers, booleans and null. 3. Identify arrays by square brackets and nested objects by braces. 4. Trace one value using its key path. 5. Count array items and distinguish index positions from keys. 6. Inspect commas, colons and quote placement. 7. Validate the sample with a parser and read any error location. 8. Change one value and validate again.

**Practice dose:** Read two small objects and one nested object; then correct three deliberately introduced syntax errors.

**Assessment and pass criterion:** Correctly explain at least 8 of 10 selected values/paths and fix malformed syntax without changing intended meaning.

**Common failure modes:** Treating every value as a string; using trailing commas where unsupported; confusing array index with object key; losing track of nested scope.

**Delayed retention check:** After one week, inspect an unfamiliar but small JSON object and trace three nested paths without a visual editor.

**Transfer task:** Apply to a configuration file or API response, identifying which fields are required and which are absent.

**Safety and scope:** Do not paste secrets, tokens or personal records into public validators. Work with fictional data.

**Evidence to record:** Sample JSON, value/path annotations, syntax errors found and parser validation result.

**Status:** Draft authored; independent subject review, learner testing and calibration required.


## MS-06-001 — Notice three levels of visual hierarchy

**Target performance:** Identify primary, secondary and tertiary visual elements and explain how size, contrast, position and spacing guide attention.

**Prerequisites and setup:** Choose a poster, webpage or app screen with no sensitive information. View it at normal size before zooming.

**Acquisition sequence:**

1. Look for two seconds and state the first element noticed. 2. Identify the next two elements that attract attention. 3. Classify them as primary, secondary or tertiary based on visual priority. 4. Inspect size, contrast, position, whitespace, alignment and grouping that create the order. 5. Check whether the hierarchy matches the intended message or action. 6. Find one competing element that distracts from the primary message. 7. Sketch a simple three-level map of the composition.

**Practice dose:** Analyse three different designs in 10 minutes; include one design with poor hierarchy.

**Assessment and pass criterion:** Identify the intended primary element and at least two supporting levels, citing concrete visual cues rather than personal taste alone.

**Common failure modes:** Assuming largest always means most important; ignoring reading order; confusing colour preference with hierarchy; missing competing elements.

**Delayed retention check:** After several days, analyse an unfamiliar screen at first glance and compare predicted attention order with another viewer’s response.

**Transfer task:** Redesign a simple information card by changing only hierarchy, then ask a viewer what they notice first.

**Safety and scope:** No special safety concern; avoid collecting screenshots containing private messages or personal details.

**Evidence to record:** Design/sample, first-glance observation, hierarchy map, cues and viewer comparison.

**Status:** Draft authored; independent subject review, learner testing and calibration required.


## MS-06-002 — Frame a phone photograph

**Target performance:** Compose a photograph intentionally by selecting subject placement, edges, background and viewpoint before pressing the shutter.

**Prerequisites and setup:** Use a phone camera and a safe stationary subject; clean the lens and disable distracting filters for the baseline.

**Acquisition sequence:**

1. Decide what the photograph should communicate. 2. Identify the main subject and remove unrelated objects from the frame by changing position. 3. Check all four edges for accidental cut-offs or intrusions. 4. Choose a viewpoint and distance that clarify shape and context. 5. Use grid lines if helpful, but do not force every subject onto a rule-of-thirds point. 6. Take one frame, review it and identify one compositional weakness. 7. Change one variable—position, distance or angle—and take a second frame. 8. Compare which frame communicates the intended subject more clearly.

**Practice dose:** Make a set of six images of one subject, changing one compositional variable at a time.

**Assessment and pass criterion:** A viewer can identify the intended subject immediately; edges are deliberate; background does not compete unnecessarily.

**Common failure modes:** Cropping important parts accidentally; placing subject centrally by habit; relying on filters to fix composition; changing too many variables at once.

**Delayed retention check:** After one week, photograph a different subject and explain the framing decision before reviewing the image.

**Transfer task:** Apply the same composition principle to a portrait, product and environmental scene, noting where the priorities differ.

**Safety and scope:** Respect privacy and obtain permission before photographing identifiable people. Do not enter unsafe locations for a shot.

**Evidence to record:** Original frames, intended message, variable changed, viewer response and selected image rationale.

**Status:** Draft authored; independent subject review, learner testing and calibration required.


## MS-06-003 — Lock focus and exposure on phone

**Target performance:** Control focus and exposure separately where the phone camera permits, then verify that the intended subject is sharp and highlights are retained.

**Prerequisites and setup:** Use a phone camera with a static subject in safe light. Camera controls differ by manufacturer and app.

**Acquisition sequence:**

1. Tap the intended subject and observe where focus is set. 2. Check whether exposure changes at the same time. 3. Use focus/exposure lock if available; note the app-specific indicator. 4. Adjust exposure compensation slightly and compare highlight and shadow detail. 5. Recompose carefully and check whether focus remains locked. 6. Capture a test image and zoom in to inspect sharpness. 7. Repeat with a backlit subject, avoiding direct sun into the lens. 8. Reset exposure/focus controls before the next scene.

**Practice dose:** Practise with three lighting conditions: even light, backlight and a darker scene.

**Assessment and pass criterion:** Subject is acceptably sharp and key highlights are not unnecessarily clipped in at least two conditions; learner can explain the app’s lock indicator.

**Common failure modes:** Assuming tap-to-focus always locks; over-darkening to save highlights; focusing on the background; forgetting exposure compensation.

**Delayed retention check:** After several days, repeat in a new scene and identify when autofocus/exposure should be allowed to adjust automatically.

**Transfer task:** Use the technique for a document, object and portrait; choose focus point according to the intended subject.

**Safety and scope:** Avoid photographing the sun or laser sources. Respect people’s privacy and do not use flash in unsafe or prohibited settings.

**Evidence to record:** Device/app, lighting, focus target, exposure adjustment, image review and delayed test.

**Status:** Draft authored; independent subject review, learner testing and calibration required.


## MS-06-004 — Use natural light direction

**Target performance:** Position a subject relative to a natural light source to control shape, contrast and background separation.

**Prerequisites and setup:** Use a stationary object near a window or shaded outdoor area; avoid direct heat or unsafe sun exposure.

**Acquisition sequence:**

1. Identify the main light source and its direction. 2. Photograph the subject with light from the front, then from the side, keeping distance and exposure similar. 3. Compare shadow shape, surface texture and depth. 4. Try backlighting and observe whether the subject becomes a silhouette or gains an edge highlight. 5. Use a reflector such as a white card only if safe and stable. 6. Move the subject rather than changing many camera settings. 7. Select the direction that supports the intended mood and visible detail.

**Practice dose:** Create three comparable frames in front, side and back light; one short session.

**Assessment and pass criterion:** Explain which direction reveals texture, which increases silhouette risk and which best suits the chosen subject.

**Common failure modes:** Assuming brighter is always better; confusing direction with intensity; changing position and exposure simultaneously; ignoring colour cast.

**Delayed retention check:** After a week, choose light direction for a new subject before taking the first photo.

**Transfer task:** Apply to a face or product only with consent and compare how light direction changes perceived form.

**Safety and scope:** Avoid staring at the sun, hot windowsills or unstable reflectors. Obtain consent for portraits.

**Evidence to record:** Light direction, subject position, comparable images and rationale for chosen frame.

**Status:** Draft authored; independent subject review, learner testing and calibration required.


## MS-06-005 — Sketch basic 3D forms

**Target performance:** Represent a simple object using box, cylinder and sphere forms with consistent perspective, proportion and light direction.

**Prerequisites and setup:** Use paper and pencil; choose a simple object or still-life arrangement. Work lightly before darkening lines.

**Acquisition sequence:**

1. Observe the object and identify its largest enclosing form. 2. Draw a light bounding box to establish height, width and placement. 3. Construct the object from simple forms: box, cylinder, sphere or combination. 4. Check visible edges and axis direction for consistent perspective. 5. Compare negative spaces and relative proportions with the reference. 6. Add one light source direction and shade the planes that face away from it. 7. Keep cast shadow distinct from form shadow. 8. Correct proportion before adding detail.

**Practice dose:** Draw three objects for 10–15 minutes each; focus on construction, not polished finish.

**Assessment and pass criterion:** A viewer can recognise the volume and orientation; major proportions are within a reasonable visual tolerance; light direction is consistent.

**Common failure modes:** Drawing outlines only; guessing perspective; shading before volume is established; making every edge equally dark.

**Delayed retention check:** After several days, draw a new object from observation and label the primitive forms used.

**Transfer task:** Use the same construction method for a simple product sketch or a diagram in a science notebook.

**Safety and scope:** Use comfortable posture and lighting; take breaks if hand or eye strain develops.

**Evidence to record:** Reference object, construction sketch, proportion corrections, light direction and delayed drawing.

**Status:** Draft authored; independent subject review, learner testing and calibration required.


## MS-06-006 — Identify dominant rhythm

**Target performance:** Recognise the recurring pulse or grouping in a short music excerpt and distinguish beat from surface activity.

**Prerequisites and setup:** Choose a clear, moderate-tempo excerpt with no sudden volume spikes. Use comfortable listening volume.

**Acquisition sequence:**

1. Listen once without tapping and describe the overall pulse. 2. Listen again and tap a steady beat at a comfortable pace. 3. Notice whether accents group the pulse in twos, threes or fours. 4. Separate the underlying beat from faster subdivisions or syncopated notes. 5. Count a short phrase and check whether the pattern repeats. 6. Compare your tapping with a metronome or trusted beat reference if available. 7. Listen again without tapping and identify where the pulse remains stable or changes.

**Practice dose:** Use two short excerpts of 20–40 seconds; repeat each no more than three times in one session.

**Assessment and pass criterion:** Maintain a steady tap through a phrase and identify the likely grouping in at least one excerpt, explaining uncertainty when syncopation obscures it.

**Common failure modes:** Tapping every note; following the loudest instrument rather than pulse; changing tempo unconsciously; assuming every piece uses simple meter.

**Delayed retention check:** After a week, identify the pulse in an unfamiliar excerpt without a visual beat guide.

**Transfer task:** Apply to a song or spoken rhythm and explain how subdivisions differ from the main beat.

**Safety and scope:** Keep volume moderate and stop if listening causes discomfort. Do not use headphones at unsafe volume or while crossing roads.

**Evidence to record:** Excerpt source, estimated pulse/grouping, tapping observation and confidence.

**Status:** Draft authored; independent subject review, learner testing and calibration required.


## MS-06-007 — Match a pitch by ear

**Target performance:** Reproduce a comfortable reference pitch with the voice or identify whether a second tone is higher, lower or approximately the same.

**Prerequisites and setup:** Use a piano, pitch app or reference tone at moderate volume. Choose a comfortable vocal range; no forced high or low notes.

**Acquisition sequence:**

1. Listen to a single reference tone. 2. Hum gently at a comfortable pitch rather than pushing the voice. 3. Compare your hum with the reference using playback or a tuner display if available. 4. Adjust gradually until the pitches are close. 5. Rest briefly and repeat with a different reference within a comfortable range. 6. Practise higher/lower comparisons without singing loudly. 7. Record whether errors tend to be sharp or flat.

**Practice dose:** Practise 3–5 minutes, three times a week; stop at the first sign of vocal strain.

**Assessment and pass criterion:** Match or closely approximate several comfortable reference tones and correctly identify higher/lower direction in most comparison trials.

**Common failure modes:** Forcing pitch outside range; confusing loudness with pitch; relying entirely on visual tuner feedback; practising while hoarse.

**Delayed retention check:** After several days, repeat with new reference pitches and compare accuracy without increasing vocal effort.

**Transfer task:** Use pitch matching to learn a short melodic interval, keeping the voice relaxed and the range comfortable.

**Safety and scope:** Do not strain, shout or continue through pain/hoarseness. Persistent vocal problems require appropriate adult/professional guidance.

**Evidence to record:** Reference tones, comfortable range, comparison results, sharp/flat tendency and vocal comfort.

**Status:** Draft authored; independent subject review, learner testing and calibration required.


## MS-06-008 — Controlled breathing for speech

**Target performance:** Use comfortable breath pacing to support a short spoken phrase without forcing inhalation or squeezing the throat.

**Prerequisites and setup:** Choose a quiet setting and an ordinary speaking passage. Stand or sit comfortably; breathing should remain natural.

**Acquisition sequence:**

1. Notice the natural breath before speaking without deliberately taking a maximum inhale. 2. Read one short sentence at a comfortable volume. 3. Pause at a natural phrase boundary and allow the next easy breath. 4. Mark phrase groups in a 3–4 sentence passage. 5. Speak each group without rushing to use all available air. 6. Record whether the final words become weak or strained. 7. Shorten phrase length if needed rather than forcing a larger breath.

**Practice dose:** Practise 3–5 minutes; use normal speech rather than prolonged breath-holding exercises.

**Assessment and pass criterion:** Deliver a short passage with stable volume and clear final words, without breathlessness, dizziness or throat tension.

**Common failure modes:** Taking huge breaths; holding breath; pushing volume; stretching phrases beyond comfort; treating breath control as a lung-capacity contest.

**Delayed retention check:** After several days, speak a fresh passage at normal conversational volume and notice whether phrase endings remain clear.

**Transfer task:** Apply to a one-minute explanation by marking natural pause points rather than speaking continuously.

**Safety and scope:** No breath-holding or hyperventilation drills. Stop if dizzy, short of breath or uncomfortable; seek adult help if symptoms persist.

**Evidence to record:** Passage, phrase marks, recording, comfort notes and delayed speaking sample.

**Status:** Draft authored; independent subject review, learner testing and calibration required.


## MS-06-009 — Observe a subject before drawing

**Target performance:** Collect accurate visual information about proportions, angles, shapes and negative spaces before committing to a drawing.

**Prerequisites and setup:** Choose a stationary object with clear edges; place it in even light. Have paper available but delay detailed drawing.

**Acquisition sequence:**

1. Look at the whole subject for 20–30 seconds before drawing. 2. Identify the largest height-to-width relationship. 3. Compare major parts using relative units (for example, “the handle is about one-third the body height”). 4. Notice alignment points, angles and repeated shapes. 5. Inspect negative spaces around and within the object. 6. Look for the lightest and darkest areas. 7. Make a small observation list or thumbnail, then begin the drawing. 8. Pause halfway and compare the drawing to the subject rather than to your memory.

**Practice dose:** Use one 5-minute observation phase before each of three short sketches.

**Assessment and pass criterion:** The sketch preserves the subject’s main proportions and relationships better than an immediate unobserved attempt; learner can name at least three measured visual relationships.

**Common failure modes:** Drawing symbols from memory; focusing on tiny details too early; ignoring negative space; assuming symmetry without checking.

**Delayed retention check:** After a week, observe and sketch a new object, then compare the first-pass proportions with the reference.

**Transfer task:** Apply observation to a product photo, scientific diagram or room layout; note which measurements matter for each task.

**Safety and scope:** Use safe, stationary subjects and comfortable posture. Do not sketch while walking or near traffic.

**Evidence to record:** Observation notes, thumbnail, final sketch, proportion comparisons and delayed task.

**Status:** Draft authored; independent subject review, learner testing and calibration required.


## MS-06-010 — Spot colour temperature shifts

**Target performance:** Distinguish warmer and cooler light or colour relationships by comparing a subject under different illumination while controlling other variables.

**Prerequisites and setup:** Use two safe light conditions such as daylight near a window and a warm indoor lamp; avoid staring at bright sources.

**Acquisition sequence:**

1. Select a neutral or familiar object and observe it under one light source. 2. Move it to the second light condition without changing camera filters or display settings. 3. Compare whether whites appear warmer/yellower or cooler/bluer. 4. Notice how the background and shadows shift as well as the subject. 5. If photographing, lock or note white-balance behaviour where possible; auto white balance may neutralise the shift. 6. Compare side-by-side images and state which variables were not controlled. 7. Avoid treating every colour difference as temperature; surface pigment and mixed lighting also matter.

**Practice dose:** Compare three objects in two light conditions; use brief observation rather than prolonged visual adaptation.

**Assessment and pass criterion:** Correctly describe relative warm/cool shifts in most comparisons and name at least one confound such as auto white balance or mixed light.

**Common failure modes:** Confusing saturation with temperature; relying on memory instead of side-by-side comparison; ignoring camera white balance; assuming blue always means cold in every context.

**Delayed retention check:** After several days, identify light-temperature differences in a new indoor/outdoor scene and explain uncertainty.

**Transfer task:** Use the distinction when selecting photo white balance or evaluating colour in a design; compare before correcting.

**Safety and scope:** Avoid looking directly at the sun or intense lamps. Keep device brightness comfortable.

**Evidence to record:** Lighting conditions, object, comparison images/notes, white-balance setting and confounds.

**Status:** Draft authored; independent subject review, learner testing and calibration required.
