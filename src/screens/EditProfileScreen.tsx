import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { colors } from '../constants/theme';
import { Header } from '../components/Header';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
];

const CURRENCIES = [
  { symbol: '₹', name: 'INR Rupee (₹)' },
  { symbol: '$', name: 'USD Dollar ($)' },
  { symbol: '€', name: 'EUR Euro (€)' },
  { symbol: '£', name: 'GBP Pound (£)' },
];

export const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, updateProfile, themeColors } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [budget, setBudget] = useState(user.monthlyBudget.toString());
  const [currency, setCurrency] = useState(user.currency);
  const [avatar, setAvatar] = useState(user.avatar);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s-]{10,14}$/.test(phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number (at least 10 digits)';
    }

    if (!budget.trim()) {
      newErrors.budget = 'Monthly budget is required';
    } else {
      const parsed = parseFloat(budget);
      if (isNaN(parsed) || parsed <= 0) {
        newErrors.budget = 'Budget must be a positive number greater than 0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      monthlyBudget: parseFloat(budget),
      currency,
      avatar,
    });

    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Header title="Edit Profile" subtitle="Update Customer Info" showBack={true} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Avatar Presets */}
          <View style={[styles.sectionBox, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
            <Text style={[styles.sectionLabel, { color: themeColors.textPrimary }]}>Select Avatar Preset</Text>
            <View style={styles.avatarRow}>
              {AVATAR_PRESETS.map((url, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setAvatar(url)}
                  style={[
                    styles.avatarChoice,
                    avatar === url && styles.avatarChoiceSelected,
                  ]}
                >
                  <Image source={{ uri: url }} style={styles.avatarChoiceImg} />
                  {avatar === url && (
                    <View style={styles.avatarCheckBadge}>
                      <Ionicons name="checkmark" size={12} color="#FFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.sectionBox}>
            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={[styles.input, errors.name ? styles.inputError : null]}
                placeholder="Gowtham S"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
              />
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={[styles.input, errors.email ? styles.inputError : null]}
                placeholder="gowtham@financetracker.com"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                }}
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            {/* Phone */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={[styles.input, errors.phone ? styles.inputError : null]}
                placeholder="+91 98765 43210"
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                }}
              />
              {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
            </View>

            {/* Monthly Budget */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Monthly Budget Cap ({currency}) *</Text>
              <TextInput
                style={[styles.input, errors.budget ? styles.inputError : null]}
                placeholder="4500"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={budget}
                onChangeText={(text) => {
                  setBudget(text);
                  if (errors.budget) setErrors((prev) => ({ ...prev, budget: '' }));
                }}
              />
              {errors.budget ? <Text style={styles.errorText}>{errors.budget}</Text> : null}
            </View>

            {/* Currency Choice */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Preferred Currency</Text>
              <View style={styles.currencyRow}>
                {CURRENCIES.map((c) => (
                  <TouchableOpacity
                    key={c.symbol}
                    style={[
                      styles.currencyChoiceBtn,
                      currency === c.symbol && styles.currencyChoiceBtnActive,
                    ]}
                    onPress={() => setCurrency(c.symbol)}
                  >
                    <Text
                      style={[
                        styles.currencyChoiceText,
                        currency === c.symbol && styles.currencyChoiceTextActive,
                      ]}
                    >
                      {c.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelBtnText}>Discard Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Ionicons name="save-outline" size={18} color="#FFF" />
              <Text style={styles.saveBtnText}>Save Profile</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionBox: {
    backgroundColor: '#131B2E',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 4,
  },
  avatarChoice: {
    position: 'relative',
    borderRadius: 30,
    padding: 3,
  },
  avatarChoiceSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarChoiceImg: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  avatarCheckBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 9,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputError: {
    borderColor: colors.expense,
  },
  errorText: {
    fontSize: 11,
    color: colors.expense,
    marginTop: 4,
    marginLeft: 2,
  },
  currencyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  currencyChoiceBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  currencyChoiceBtnActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  currencyChoiceText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  currencyChoiceTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelBtnText: {
    color: colors.textSecondary,
    fontSize: 13.5,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1.5,
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
