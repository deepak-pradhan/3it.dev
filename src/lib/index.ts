// Utilities
export { cn, type WithElementRef, type WithoutChildrenOrChild, type WithoutChild } from './utils';

// Stores
export { themeStore } from './stores/theme.svelte';

// Components - use namespaced imports to avoid conflicts
import * as ButtonPrimitive from './components/ui/button';
import * as CardPrimitive from './components/ui/card';
import * as DialogPrimitive from './components/ui/dialog';
import * as DropdownMenuPrimitive from './components/ui/dropdown-menu';
import * as InputPrimitive from './components/ui/input';

// Re-export as namespaced objects
export { ButtonPrimitive, CardPrimitive, DialogPrimitive, DropdownMenuPrimitive, InputPrimitive };

// Re-export commonly used components with their full names (no conflicts)
export {
  Button,
  buttonVariants,
  type ButtonProps,
  type ButtonSize,
  type ButtonVariant,
} from './components/ui/button';

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './components/ui/card';

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from './components/ui/dialog';

export {
  DropdownMenu,
  DropdownMenuCheckboxGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuGroupHeading,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu';

export { Input } from './components/ui/input';

export { ThemeToggle } from './components/ui/theme-toggle';
// Editor component requires @tiptap/* packages - uncomment when installed:
// export { Editor } from './components/ui/editor';
export { Breadcrumb } from './components/ui/breadcrumb';
