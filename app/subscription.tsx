
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
} from 'react-native';

export default function SubscriptionScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePlanSelect = (planId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPlan(planId);
  };

  const handleSubmit = () => {
    if (!selectedPlan) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Navigate to loading screen or dashboard
    router.push('/loading-screen');
  };

  const plans = [
    {
      id: 'support',
      name: 'Support+',
      price: '$9.99/month',
      features: [
        'Basic community access',
        'Weekly group sessions',
        'Essential resources',
        'Email support'
      ],
      popular: false,
    },
    {
      id: 'companion',
      name: 'Companion+',
      price: '$19.99/month',
      features: [
        'Everything in Support+',
        'AI companion chat',
        'Daily check-ins',
        'Advanced tracking',
        'Priority support'
      ],
      popular: true,
    },
    {
      id: 'mentorship',
      name: 'Mentorship+',
      price: '$39.99/month',
      features: [
        'Everything in Companion+',
        '1-on-1 mentorship sessions',
        'Personalized growth plans',
        'Direct mentor access',
        'Premium content library'
      ],
      popular: false,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Choose Your Journey</Text>
          <Text style={styles.subtitle}>Select the plan that best fits your growth goals</Text>
        </View>

        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.selectedPlan,
                plan.popular && styles.popularPlan
              ]}
              onPress={() => handlePlanSelect(plan.id)}
              activeOpacity={0.8}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>Most Popular</Text>
                </View>
              )}
              
              <View style={styles.planHeader}>
                <Text style={[
                  styles.planName,
                  selectedPlan === plan.id && styles.selectedPlanText
                ]}>
                  {plan.name}
                </Text>
                <Text style={[
                  styles.planPrice,
                  selectedPlan === plan.id && styles.selectedPlanText
                ]}>
                  {plan.price}
                </Text>
              </View>

              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Text style={styles.checkmark}>✓</Text>
                    <Text style={[
                      styles.featureText,
                      selectedPlan === plan.id && styles.selectedFeatureText
                    ]}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>

              {selectedPlan === plan.id && (
                <View style={styles.selectedIndicator}>
                  <Text style={styles.selectedIndicatorText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            !selectedPlan && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!selectedPlan}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.submitButtonText,
            !selectedPlan && styles.submitButtonTextDisabled
          ]}>
            Continue with {selectedPlan ? plans.find(p => p.id === selectedPlan)?.name : 'Selected Plan'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/dashboard');
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          You can change or cancel your subscription at any time in settings.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8D4F0',
  },
  content: {
    flexGrow: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'System',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#34495E',
    textAlign: 'center',
    fontFamily: 'System',
    opacity: 0.8,
    paddingHorizontal: 20,
  },
  plansContainer: {
    gap: 16,
    marginBottom: 40,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(44, 62, 80, 0.1)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  popularPlan: {
    borderColor: '#2C3E50',
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  selectedPlan: {
    backgroundColor: '#FFF8E7',
    borderColor: '#2C3E50',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 20,
    backgroundColor: '#2C3E50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'System',
  },
  planHeader: {
    marginBottom: 20,
    marginTop: 8,
  },
  planName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    fontFamily: 'System',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495E',
    fontFamily: 'System',
  },
  selectedPlanText: {
    color: '#2C3E50',
  },
  featuresContainer: {
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    width: 20,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#34495E',
    fontFamily: 'System',
    flex: 1,
    lineHeight: 22,
  },
  selectedFeatureText: {
    color: '#2C3E50',
    fontWeight: '500',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2C3E50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIndicatorText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#FFF8E7',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: 'rgba(255, 248, 231, 0.5)',
    shadowOpacity: 0.1,
    elevation: 2,
  },
  submitButtonText: {
    color: '#2C3E50',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'System',
  },
  submitButtonTextDisabled: {
    color: '#34495E',
    opacity: 0.6,
  },
  skipButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(44, 62, 80, 0.3)',
  },
  skipButtonText: {
    color: '#34495E',
    fontSize: 17,
    fontWeight: '500',
    fontFamily: 'System',
  },
  disclaimer: {
    fontSize: 13,
    color: '#34495E',
    textAlign: 'center',
    fontFamily: 'System',
    opacity: 0.7,
    lineHeight: 18,
  },
});
