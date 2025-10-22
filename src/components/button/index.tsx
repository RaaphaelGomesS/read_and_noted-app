import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface StyledButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
}

export function StyledButton({ title, variant = 'primary', ...props }: StyledButtonProps) {
  const buttonStyle =
    variant === 'primary' ? styles.primaryButton : styles.secondaryButton;
  const textStyle =
    variant === 'primary' ? styles.primaryText : styles.secondaryText;

  return (
    <TouchableOpacity style={[styles.buttonBase, buttonStyle]} {...props}>
      <Text style={[styles.textBase, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 150,
    marginTop: 8
  },
  textBase: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  primaryButton: {
    backgroundColor: Colors.accent,
  },
  primaryText: {
    color: Colors.text,
  },
  secondaryButton: {
    backgroundColor: Colors.surface,
  },
  secondaryText: {
    color: Colors.text,
  },
});