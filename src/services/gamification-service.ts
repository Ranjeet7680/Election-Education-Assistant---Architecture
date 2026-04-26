import { Badge, UserProgress, QuizQuestion } from '../types/election';

/**
 * Gamification service to make election education engaging
 * Handles badges, progress tracking, and achievements
 */

export class GamificationService {
  private static readonly BADGES: Record<string, Omit<Badge, 'earnedAt'>> = {
    first_timer: {
      id: 'first_timer',
      name: 'First Time Voter Ready! 🎉',
      description: 'Completed the first-time voter guide',
      icon: '🗳️'
    },
    quiz_master: {
      id: 'quiz_master',
      name: 'Quiz Master 🏆',
      description: 'Scored 80% or higher in the voting quiz',
      icon: '🎯'
    },
    registered: {
      id: 'registered',
      name: 'Registered Voter ✅',
      description: 'Successfully registered as a voter',
      icon: '📝'
    },
    informed_citizen: {
      id: 'informed_citizen',
      name: 'Informed Citizen 📚',
      description: 'Learned about all election phases',
      icon: '🧠'
    },
    booth_finder: {
      id: 'booth_finder',
      name: 'Booth Finder 📍',
      description: 'Located your polling booth',
      icon: '🗺️'
    },
    document_ready: {
      id: 'document_ready',
      name: 'Document Ready 📄',
      description: 'Learned about all required documents',
      icon: '✓'
    },
    perfect_score: {
      id: 'perfect_score',
      name: 'Perfect Score! 💯',
      description: 'Got 100% in the voting quiz',
      icon: '⭐'
    },
    democracy_champion: {
      id: 'democracy_champion',
      name: 'Democracy Champion 🏅',
      description: 'Completed all learning modules',
      icon: '👑'
    }
  };

  /**
   * Check and award badges based on user progress
   */
  checkAndAwardBadges(progress: UserProgress, quizScore?: number): Badge[] {
    const newBadges: Badge[] = [];
    const existingBadgeIds = progress.badges.map(b => b.id);

    // Quiz-based badges
    if (quizScore !== undefined) {
      if (quizScore === 100 && !existingBadgeIds.includes('perfect_score')) {
        newBadges.push(this.createBadge('perfect_score'));
      } else if (quizScore >= 80 && !existingBadgeIds.includes('quiz_master')) {
        newBadges.push(this.createBadge('quiz_master'));
      }
    }

    // Progress-based badges
    const completedSteps = progress.completedSteps;

    if (completedSteps.includes('registration') && !existingBadgeIds.includes('registered')) {
      newBadges.push(this.createBadge('registered'));
    }

    if (completedSteps.includes('booth_location') && !existingBadgeIds.includes('booth_finder')) {
      newBadges.push(this.createBadge('booth_finder'));
    }

    if (completedSteps.includes('documents_learned') && !existingBadgeIds.includes('document_ready')) {
      newBadges.push(this.createBadge('document_ready'));
    }

    if (completedSteps.includes('timeline_learned') && !existingBadgeIds.includes('informed_citizen')) {
      newBadges.push(this.createBadge('informed_citizen'));
    }

    if (completedSteps.includes('first_time_guide') && !existingBadgeIds.includes('first_timer')) {
      newBadges.push(this.createBadge('first_timer'));
    }

    // Democracy Champion - all modules completed
    const requiredSteps = ['registration', 'booth_location', 'documents_learned', 'timeline_learned', 'voting_process'];
    const allCompleted = requiredSteps.every(step => completedSteps.includes(step));
    
    if (allCompleted && quizScore && quizScore >= 80 && !existingBadgeIds.includes('democracy_champion')) {
      newBadges.push(this.createBadge('democracy_champion'));
    }

    return newBadges;
  }

  private createBadge(badgeId: string): Badge {
    const badgeTemplate = GamificationService.BADGES[badgeId];
    return {
      ...badgeTemplate,
      earnedAt: new Date()
    };
  }

  /**
   * Calculate quiz score
   */
  calculateQuizScore(questions: QuizQuestion[], userAnswers: number[]): number {
    if (questions.length === 0) return 0;

    const correctAnswers = questions.filter((q, index) => 
      q.correctAnswer === userAnswers[index]
    ).length;

    return Math.round((correctAnswers / questions.length) * 100);
  }

  /**
   * Get motivational message based on score
   */
  getScoreMessage(score: number): string {
    if (score === 100) {
      return "🎉 Perfect! You're a voting expert! 💯";
    } else if (score >= 80) {
      return "🌟 Excellent! You're well-prepared to vote! 🗳️";
    } else if (score >= 60) {
      return "👍 Good job! Review the topics you missed and try again! 📚";
    } else if (score >= 40) {
      return "📖 Keep learning! Go through the guides again and retake the quiz! 💪";
    } else {
      return "🎯 Don't worry! Start with the basics and work your way up! 🚀";
    }
  }

  /**
   * Get progress percentage
   */
  calculateProgress(completedSteps: string[]): number {
    const totalSteps = ['registration', 'booth_location', 'documents_learned', 'timeline_learned', 'voting_process', 'quiz_completed'];
    const completed = completedSteps.filter(step => totalSteps.includes(step)).length;
    return Math.round((completed / totalSteps.length) * 100);
  }

  /**
   * Get next recommended action
   */
  getNextAction(progress: UserProgress): string {
    const completed = progress.completedSteps;

    if (!completed.includes('registration')) {
      return "✍️ Learn how to register as a voter";
    }
    if (!completed.includes('documents_learned')) {
      return "📄 Check what documents you need";
    }
    if (!completed.includes('timeline_learned')) {
      return "📅 Understand the election timeline";
    }
    if (!completed.includes('booth_location')) {
      return "📍 Find your polling booth";
    }
    if (!completed.includes('voting_process')) {
      return "🗳️ Learn the voting process step-by-step";
    }
    if (!completed.includes('quiz_completed')) {
      return "🎯 Test your knowledge with a quiz";
    }

    return "🏆 You've completed everything! Share your knowledge with others!";
  }

  /**
   * Generate shareable achievement text
   */
  generateShareText(badge: Badge): string {
    return `🎉 I just earned the "${badge.name}" badge! ${badge.description} 
    
Learn about voting and elections at [Your App URL]
#VoterEducation #Democracy #FirstTimeVoter`;
  }
}

export const gamificationService = new GamificationService();
