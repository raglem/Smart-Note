import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableItem({
    id,
    children,
  }: {
    id: number;
    children: (props: {
      listeners: ReturnType<typeof useSortable>["listeners"];
      attributes: ReturnType<typeof useSortable>["attributes"];
      setNodeRef: (node: HTMLElement | null) => void;
      style: React.CSSProperties;
    }) => React.ReactNode;
  }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
  
    return (
      <>
        {children({
          listeners,
          attributes,
          setNodeRef,
          style,
        })}
      </>
    );
  }
  