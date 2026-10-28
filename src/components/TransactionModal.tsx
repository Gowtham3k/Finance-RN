/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors } from '../constants/theme';
import { Transaction, TransactionType } from '../types';

interface TransactionModalProps {
  visible: boolean;
  onClose: () => void;
  transactionToEdit?: Transaction | null;
  defaultCategoryId?: string;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  visible,
  onClose,
  transactionToEdit,
  defaultCategoryId,
}) => {
  const { categories, addTransaction, updateTransaction, user, themeColors } = useApp();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [date, setDate] = useState('2026-10-28');
  const [note, setNote] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (transactionToEdit) {
      setTitle(transactionToEdit.title);
      setAmount(transactionToEdit.amount.toString());
      setType(transactionToEdit.type);
      setSelectedCategoryId(transactionToEdit.categoryId);
      setDate(transactionToEdit.date);
      setNote(transactionToEdit.note || '');
    } else {
      setTitle('');
      setAmount('');
      setType('expense');
      setSelectedCategoryId(
        defaultCategoryId ||
          categories.find((c) => c.type === 'expense')?.id ||
          categories[0]?.id ||
          ''
      );
      setDate('2026-10-28');
      setNote('');
    }
    setErrors({});
  }, [transactionToEdit, visible, defaultCategoryId, categories]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Transaction title is required';
    } else if (title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
    }

    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else {
      const parsed = parseFloat(amount);
      if (isNaN(parsed) || parsed <= 0) {
        newErrors.amount = 'Please enter a valid positive number greater than 0';
      }
    }

    if (!selectedCategoryId) {
      newErrors.category = 'Please select a category';
    }

    if (!date.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
      newErrors.date = 'Date must be formatted as YYYY-MM-DD';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

    if (transactionToEdit) {
      updateTransaction({
        ...transactionToEdit,
        title: title.trim(),
        amount: parseFloat(amount),
        type,
        categoryId: selectedCategoryId,
        categoryName: selectedCategory?.name || 'General',
        categoryIcon: selectedCategory?.icon || 'card',
        categoryColor: selectedCategory?.color || colors.primary,
        date: date.trim(),
        time: '12:00',
        month: date.trim().substring(0, 7),
        note: note.trim(),
      });
    } else {
      addTransaction({
        title: title.trim(),
        amount: parseFloat(amount),
        type,
        categoryId: selectedCategoryId,
        categoryName: selectedCategory?.name || 'General',
        categoryIcon: selectedCategory?.icon || 'card',
        categoryColor: selectedCategory?.color || colors.primary,
        date: date.trim(),
        time: '12:00',
        note: note.trim(),
      });
    }

    onClose();
  };

  const availableCategories = categories.filter((c) =>
    type === 'expense' ? c.type !== 'income' : c.type === 'income'
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={[styles.modalContent, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
          {/* Header */}
          <View style={[styles.modalHeader, { borderBottomColor: themeColors.border }]}>
            <Text style={[styles.modalTitle, { color: themeColors.textPrimary }]}>
              {transactionToEdit ? 'Edit Transaction' : 'Record New Transaction'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={themeColors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Type Switcher (Expense vs Income) */}
            <View style={[styles.typeSelector, { backgroundColor: themeColors.cardSecondary }]}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === 'expense' && styles.typeButtonExpenseActive,
                ]}
                onPress={() => {
                  setType('expense');
                  const firstExpenseCat = categories.find((c) => c.type === 'expense');
                  if (firstExpenseCat) setSelectedCategoryId(firstExpenseCat.id);
                }}
              >
                <Ionicons
                  name="arrow-down-circle"
                  size={16}
                  color={type === 'expense' ? '#FFF' : themeColors.textMuted}
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    { color: type === 'expense' ? '#FFF' : themeColors.textMuted },
                    type === 'expense' && styles.typeButtonTextActive,
                  ]}
                >
                  Expense (-)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === 'income' && styles.typeButtonIncomeActive,
                ]}
                onPress={() => {
                  setType('income');
                  const firstIncomeCat = categories.find((c) => c.type === 'income');
                  if (firstIncomeCat) setSelectedCategoryId(firstIncomeCat.id);
                }}
              >
                <Ionicons
                  name="arrow-up-circle"
                  size={16}
                  color={type === 'income' ? '#FFF' : themeColors.textMuted}
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    { color: type === 'income' ? '#FFF' : themeColors.textMuted },
                    type === 'income' && styles.typeButtonTextActive,
                  ]}
                >
                  Income (+)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Title Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: themeColors.textSecondary }]}>Transaction Title *</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: themeColors.cardSecondary, color: themeColors.textPrimary, borderColor: themeColors.border },
                  errors.title ? styles.inputError : null,
                ]}
                placeholder="e.g. Grocery Restock, Uber Ride, Client Payment"
                placeholderTextColor={themeColors.textMuted}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                }}
              />
              {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
            </View>

            {/* Amount Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: themeColors.textSecondary }]}>Amount ({user.currency}) *</Text>
              <View
                style={[
                  styles.amountInputContainer,
                  { backgroundColor: themeColors.cardSecondary, borderColor: themeColors.border },
                  errors.amount ? styles.inputError : null,
                ]}
              >
                <Text style={[styles.currencySymbol, { color: themeColors.textPrimary }]}>{user.currency}</Text>
                <TextInput
                  style={[styles.amountInput, { color: themeColors.textPrimary }]}
                  placeholder="0.00"
                  placeholderTextColor={themeColors.textMuted}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={(text) => {
                    setAmount(text);
                    if (errors.amount) setErrors((prev) => ({ ...prev, amount: '' }));
                  }}
                />
              </View>
              {errors.amount ? <Text style={styles.errorText}>{errors.amount}</Text> : null}
            </View>

            {/* Category Selector */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: themeColors.textSecondary }]}>Select Category *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
                {availableCategories.map((cat) => {
                  const isSelected = selectedCategoryId === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.catPill,
                        { backgroundColor: themeColors.cardSecondary, borderColor: themeColors.border },
                        isSelected && { borderColor: cat.color, backgroundColor: cat.color + '22' },
                      ]}
                      onPress={() => setSelectedCategoryId(cat.id)}
                    >
                      <View style={[styles.catIconCircle, { backgroundColor: cat.color + '33' }]}>
                        <Ionicons name={cat.icon as any} size={14} color={cat.color} />
                      </View>
                      <Text
                        style={[
                          styles.catPillText,
                          { color: themeColors.textMuted },
                          isSelected && { color: themeColors.textPrimary, fontWeight: '700' },
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              {errors.category ? <Text style={styles.errorText}>{errors.category}</Text> : null}
            </View>

            {/* Date Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: themeColors.textSecondary }]}>Date (YYYY-MM-DD) *</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: themeColors.cardSecondary, color: themeColors.textPrimary, borderColor: themeColors.border },
                  errors.date ? styles.inputError : null,
                ]}
                placeholder="2026-10-28"
                placeholderTextColor={themeColors.textMuted}
                value={date}
                onChangeText={(text) => {
                  setDate(text);
                  if (errors.date) setErrors((prev) => ({ ...prev, date: '' }));
                }}
              />
              {errors.date ? <Text style={styles.errorText}>{errors.date}</Text> : null}
            </View>

            {/* Note / Memo */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: themeColors.textSecondary }]}>Note (Optional)</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: themeColors.cardSecondary, color: themeColors.textPrimary, borderColor: themeColors.border, height: 70, textAlignVertical: 'top' },
                ]}
                placeholder="Additional details..."
                placeholderTextColor={themeColors.textMuted}
                multiline
                numberOfLines={3}
                value={note}
                onChangeText={setNote}
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.cancelBtn, { backgroundColor: themeColors.cardSecondary, borderColor: themeColors.border }]}
                onPress={onClose}
              >
                <Text style={[styles.cancelBtnText, { color: themeColors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: themeColors.primary }]}
                onPress={handleSave}
              >
                <Ionicons name="checkmark-circle-outline" size={18} color="#FFF" />
                <Text style={styles.saveBtnText}>
                  {transactionToEdit ? 'Save Changes' : 'Record Transaction'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#131B2E',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: colors.border,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  closeBtn: {
    padding: 6,
  },
  scrollBody: {
    padding: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#090D16',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  typeButtonExpenseActive: {
    backgroundColor: colors.expense,
  },
  typeButtonIncomeActive: {
    backgroundColor: colors.income,
  },
  typeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  typeButtonTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
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
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  inputError: {
    borderColor: colors.expense,
  },
  errorText: {
    color: colors.expense,
    fontSize: 11.5,
    marginTop: 4,
    marginLeft: 2,
  },
  catScroll: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  catIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  catPillText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelBtnText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.primary,
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
