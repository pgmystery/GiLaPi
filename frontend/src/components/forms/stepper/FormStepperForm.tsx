interface FormStepperFormProps {
  children?: React.ReactNode
  activeStage: number
  index: number
  label: string
}

export default function FormStepperForm({ children, activeStage, index }: FormStepperFormProps) {
  return activeStage === index && children
}
