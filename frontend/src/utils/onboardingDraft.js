const keyFor = (userId) => `onboarding_draft:${userId}`

export function loadDraft(userId) {
    try {
        return JSON.parse(localStorage.getItem(keyFor(userId))) || {}
    } catch {
        return {}
    }
}

export function saveDraft(userId, draft) {
    localStorage.setItem(keyFor(userId), JSON.stringify(draft))
}

export function clearDraft(userId) {
    localStorage.removeItem(keyFor(userId))
}

// Where should we send an unfinished user? Depends on what step they were on
// 2-4 are the Onboarding questions and 5 means they are done and have to do Availability
// the notice wasn't working properly cause I forgot 'label'
export function nextOnboardingStep(draft) {
    if (!draft.campus?.trim()) return { path: '/onboarding', step: 2, label: 'your campus' }
    if (!draft.courses?.length) return { path: '/onboarding', step: 3, label: 'your courses' }
    if (!draft.goals?.length || !draft.style?.length) return { path: '/onboarding', step: 4, label: 'your goals and study style' }
    return { path: '/availability', step: 5, label: 'your availability' }
}