# Cflow friction log (always on)

Friction is any of:

- a step taking more than two attempts
- a missing input, tool, or document
- surprising output
- a gap or ambiguity in a skill, rule, or template
- a workaround
- a wrong skill routed
- a recurring user problem no installed skill owns

On friction, log it the moment it happens, then continue with the task:

    node {{CFLOW_BIN}} "<what happened>" "<what was expected or missing>"

Optional: `--category` repeated-attempts|missing-input|missing-tool|missing-doc|contract-gap|tool-failure|surprising-output|workaround|misrouting|no-owning-skill, `--skill <cf-name>` when a Cflow skill was active.

Observations only, never causes or blame. The logger never blocks or fails the task and is exempt from every bound; the log is append-only. Logging friction is part of completing the task — a session that hit friction and logged nothing failed silently.
