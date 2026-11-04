const KEY = 'profile'

export function loadDraft() {
    try {
        return JSON.parse(localStorage.getItem(KEY)) || {}
    } catch {
        return {}
    }
}

export function saveDraft(draft) {
    localStorage.setItem(KEY, JSON.stringify(draft))
}

export function clearDraft() {
    localStorage.removeItem(KEY)
}

// Where should we send an unfinished user? Depends on what step they were on
// 2-4 are the Onboarding questions and 5 means they are done and have to do Availability
export function nextOnboardingStep(draft = loadDraft()) {
    if (!draft.campus?.trim()) return { path: '/onboarding', step: 2 }
    if (!draft.courses?.length) return { path: '/onboarding', step: 3 }
    if (!draft.goals?.length || !draft.style?.length) return { path: '/onboarding', step: 4 }
    return { path: '/onboarding', step: 5 }
}