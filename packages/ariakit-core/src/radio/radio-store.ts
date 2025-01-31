import type {
  CompositeStoreFunctions,
  CompositeStoreOptions,
  CompositeStoreState,
} from "../composite/composite-store.js";
import { createCompositeStore } from "../composite/composite-store.js";
import { defaultValue } from "../utils/misc.js";
import type { Store, StoreOptions, StoreProps } from "../utils/store.js";
import { createStore } from "../utils/store.js";
import type { SetState } from "../utils/types.js";

/**
 * Creates a radio store.
 */
export function createRadioStore({
  ...props
}: RadioStoreProps = {}): RadioStore {
  const syncState = props.store?.getState();

  const composite = createCompositeStore({
    ...props,
    focusLoop: defaultValue(props.focusLoop, syncState?.focusLoop, true),
  });

  const initialState: RadioStoreState = {
    ...composite.getState(),
    value: defaultValue(
      props.value,
      syncState?.value,
      props.defaultValue,
      null,
    ),
  };

  const radio = createStore(initialState, composite, props.store);

  return {
    ...composite,
    ...radio,
    setValue: (value) => radio.setState("value", value),
  };
}

export interface RadioStoreState extends CompositeStoreState {
  /**
   * @default true
   */
  focusLoop: CompositeStoreState["focusLoop"];
  /**
   * The value of the radio group.
   * @default null
   */
  value: string | number | null;
}

export interface RadioStoreFunctions extends CompositeStoreFunctions {
  /**
   * Sets the [`value`](https://ariakit.org/reference/radio-provider#value)
   * state.
   * @example
   * store.setValue("apple");
   * store.setValue((value) => value === "apple" ? "orange" : "apple");
   */
  setValue: SetState<RadioStoreState["value"]>;
}

export interface RadioStoreOptions
  extends CompositeStoreOptions,
    StoreOptions<RadioStoreState, "focusLoop" | "value"> {
  /**
   * The default value of the radio group.
   * @default null
   */
  defaultValue?: RadioStoreState["value"];
}

export interface RadioStoreProps
  extends RadioStoreOptions,
    StoreProps<RadioStoreState> {}

export interface RadioStore
  extends RadioStoreFunctions,
    Store<RadioStoreState> {}
