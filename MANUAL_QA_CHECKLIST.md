# Manual QA Checklist - Phase 9A

## Scope

Use this checklist for a human demo pass after the automated Phase 9A checks. The app is local-only and should be opened at:

`http://localhost:5175/`

## Student Regression

1. Login as the student role.
2. Open `/courses`.
   - Confirm current courses render.
   - Confirm course search/filter remains usable.
3. Open `/demo`.
   - Confirm unit tabs work.
   - Confirm Contact Lecturer opens and closes correctly.
4. Open `/demo/learn`.
   - Confirm Learning Method Studio renders.
   - Confirm AI Tutor input, follow-ups, and learning methods remain usable.
   - Confirm no video or podcast repair was introduced in Phase 9A.
5. Open `/demo/assessment`.
   - Confirm assignment brief, rubric, timeline, draft states, final submission confirmation, local receipt, reflection, lecturer feedback state, and contact workflow remain present.
   - Confirm Contact Lecturer validates empty fields, supports Copy message, opens encoded email draft, traps focus, closes with Escape, and restores focus.
6. Open `/demo/trust`.
   - Confirm governance content renders.

## Lecturer Dashboard

1. Login as lecturer.
2. Open `/lecturer`.
   - Confirm first viewport answers what needs attention today.
   - Confirm Review Queue link opens `/lecturer/review`.
   - Confirm Prepare announcement opens the communication dialog.
   - Confirm Copy message and Open in email are available.
   - Confirm no message-sent claim appears.

## Assignment Queue

1. Open `/lecturer/assignments`.
2. Search for `Marcus`.
   - Confirm only Marcus appears in the queue table.
3. Use filters: All, Final, Draft, Needs review, Ready.
   - Confirm queue rows update.
4. Toggle sort.
   - Confirm sort label changes and rows reorder.
5. Open at least two submissions.
   - Confirm selected state and workbench context update.
6. Confirm table scrolls internally on narrow widths.

## Review Workbench

1. Confirm student/submission context, brief, rubric, evidence, AI recommendation, source basis, uncertainty, and audit history render.
2. Click Edit recommendation.
   - Confirm rubric-level feedback fields and overall comments appear.
   - Confirm saved/unsaved indicator changes.
3. Save draft feedback.
   - Confirm quiet saved state.
4. Finalise feedback.
   - Confirm local decision state appears and no server-send claim is made.
5. Test Accept, Override, Reject, Request revision, Reset decision.
   - Confirm each visibly updates state.
6. Open Contact student.
   - Confirm dialog accessibility, validation, copy fallback, encoded mailto, Escape close, and focus restoration.

## Review Queue

1. Open `/lecturer/review`.
2. Confirm priority, submission type, reason, confidence, age, status, and action columns are visible.
3. Resolve an item.
   - Confirm active count/state updates locally.
4. Use approve/edit/reject on pending AI questions.
   - Confirm local-only feedback is explicit.

## Knowledge Base

1. Open `/lecturer/knowledge`.
2. Select each source.
   - Confirm provenance, version, status, owner, reuse boundary, and teaching impact update.
3. Test Approve, Edit, Reject, View source, Affected experiences, Version/history.
   - Confirm every action gives honest local-only feedback.
4. Confirm raw student chat remains excluded.

## Lecturer Trust

1. Open `/lecturer/trust`.
2. Confirm governance content renders and no student-only workflow appears.

## Responsive Pass

Check these widths manually if browser automation is not available:

- 1440px
- 1280px
- 1024px
- 768px
- 390px

For each width, verify:

- no page-level horizontal overflow
- queue table remains usable
- workbench stacks correctly
- dialogs fit the viewport
- mobile bottom navigation does not overlap primary actions
- buttons do not clip

## Console

Open browser developer tools and confirm no new runtime errors appear after a hard refresh of:

- `/lecturer`
- `/lecturer/assignments`
- `/lecturer/review`
- `/lecturer/knowledge`
- `/demo/assessment`
- `/demo/learn`
