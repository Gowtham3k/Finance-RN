import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors } from '../constants/theme';
import { Category } from '../types';

interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
  categoryToEdit?: Category | null;
}

const AVAILABLE_ICONS = [
  'restaurant',
  'cart',
  'home',
  'car',
  'flash',
  'game-controller',
  'fitness',
  'airplane',
  'gift',
  'book',
  'school',
  'medkit',
  'cafe',
  'cash',
  'laptop',
];

const AVAILABLE_COLORS = [
  '#F59E0B',
  '#EC4899',
  '#6366F1',
  '#3B82F6',
  '#06B6D4',
  '#8B5CF6',
  '#10B981',
  '#F43F5E',
  '#EAB308',
  '#14B8A6',
];

export const CategoryModal: React.FC<CategoryModalProps> = ({
  visible,
  onClose,
  categoryToEdit,
}) => {
  const { addCategory, updateCategory, user, themeColors } = useApp();

  const [name, setName] = useState(categoryToEdit?.name || '');
  const [budget, setBudget] = useState(categoryToEdit?.budget?.toString() || '');
  const type = categoryToEdit?.type || 'expense';
  const [selectedIcon, setSelectedIcon] = useState(categoryToEdit?.icon || 'cart');
  const [selectedColor, setSelectedColor] = useState(categoryToEdit?.color || '#6366F1');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Category name must be at least 2 characters';
    }

    if (!budget.trim()) {
      newErrors.budget = 'Monthly budget limit is required';
    } else {
      const parsed = parseFloat(budget);
      if (isNaN(parsed) || parsed <= 0) {
        newErrors.budget = 'Budget must be a valid number greater than 0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    if (categoryToEdit) {
      updateCategory({
        ...categoryToEdit,
        name: name.trim(),
        budget: parseFloat(budget),
        type,
        icon: selectedIcon,
        color: selectedColor,
      });
    } else {
      addCategory({
        name: name.trim(),
        budget: parseFloat(budget),
        type,
        icon: selectedIcon,
        color: selectedColor,
      });
    }

    setName('');
    setBudget('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
          <View style={[styles.modalHeader, { borderBottomColor: themeColors.border }]}>
            <Text style={[styles.modalTitle, { color: themeColors.textPrimary }]}>
              {categoryToEdit ? 'Edit Category' : 'Create New Category'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Category Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category Name *</Text>
              <TextInput
                style={[styles.input, errors.name ? styles.inputError : null]}
                placeholder="e.g. Travel, Education, Gadgets"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
              />
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>

            {/* Monthly Budget Cap */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Monthly Budget Limit ({user.currency}) *</Text>
              <TextInput
                style={[styles.input, errors.budget ? styles.inputError : null]}
                placeholder="e.g. 500"
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

            {/* Icon Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Select Icon</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconScroll}>
                {AVAILABLE_ICONS.map((icon) => (
                  <TouchableOpacity
                    key={icon}
                    style={[
                      styles.iconSelectBox,
                      selectedIcon === icon && { borderColor: selectedColor, backgroundColor: selectedColor + '25' },
                    ]}
                    onPress={() => setSelectedIcon(icon)}
                  >
                    <Ionicons
                      name={icon as any}
                      size={20}
                      color={selectedIcon === icon ? selectedColor : colors.textSecondary}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Color Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Select Color Accent</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconScroll}>
                {AVAILABLE_COLORS.map((clr) => (
                  <TouchableOpacity
                    key={clr}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: clr },
                      selectedColor === clr && styles.colorCircleSelected,
                    ]}
                    onPress={() => setSelectedColor(clr)}
                  >
                    {selectedColor === clr && (
                      <Ionicons name="checkmark" size={14} color="#FFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>
                  {categoryToEdit ? 'Save Changes' : 'Create Category'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
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
    maxHeight: '85%',
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
  inputError: {
    borderColor: colors.expense,
  },
  errorText: {
    color: colors.expense,
    fontSize: 11.5,
    marginTop: 4,
  },
  iconScroll: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  iconSelectBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  colorCircleSelected: {
    borderWidth: 3,
    borderColor: '#FFF',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
    marginBottom: 16,
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
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
