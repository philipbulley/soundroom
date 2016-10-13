import { Action, ActionReducer } from '@ngrx/store';

interface ActionStatic<A, P> {
  new(): A;
  prototype: {payload?: P};
}

interface PayloadCommandFn<S, P, A> {
  ( state: S, payload: P, action?: A ): S;
}

interface DelegateCommandFn<S, A> {
  ( state: S, action?: A ): S;
}

interface ActionCommandMapping<A, P, S> {
  type: CommandType;
  action: ActionStatic<A, P>;
  command: PayloadCommandFn<S, P, A>;
}

interface DelegateActionCommandMapping<A, P, S> {
  type: CommandType;
  action: ActionStatic<A, P>;
  command: DelegateCommandFn<S, A>;
}

interface ActionDelegateReducerMapping<A, P, S, SS> {
  action: ActionStatic<A, P>;
  reducer: ActionReducer<SS>;
  getSubState: ( state: S ) => SS[];
  setSubState: ( state: S, subState: SS ) => S;
}

enum CommandType {
  PAYLOAD,
  DELEGATE
}


export class CommandReducer<S> {
  private _map = [];

  constructor( private defaultState: S ) {
    //
  }

  /**
   * Call `add` to map a command that is explicitly typed to handle a particular payload — the same type of payload as the
   * corresponding action.
   *
   * @param action
   * @param command
   * @returns {CommandReducer}
   */
  add = <A extends Action, P>( action: ActionStatic<A, P>, command: PayloadCommandFn<S, P, A> ) => {
    this._map.push({
      type: CommandType.PAYLOAD,
      action,
      command,
    } as ActionCommandMapping<A, P, S>);

    return this;
  };

  /**
   * Call `delegate()` to map an action to a command that isn't interested in a specific payload type. Ideal for simply
   * forwarding an action onto another reducer. In which case, you can call the other reducer by passing it the action
   * and state (useful for running reducers on child properties of the state).
   *
   * Don't use `delegate()` if the command will access `action.payload`, as the payload wont be type checked. Use
   * `add()` instead.
   *
   * @param action
   * @param command
   * @returns {CommandReducer}
   */
  delegate = <A extends Action, P>( action: ActionStatic<A, P>, command: DelegateCommandFn<S, A> ) => {
    this._map.push({
      type: CommandType.DELEGATE,
      action,
      command,
    } as DelegateActionCommandMapping<A, P, S>);

    return this;
  };

  reducer = (): ActionReducer<S> => this._reducer;

  private _reducer: ActionReducer<S> = ( state: S, action: Action ): S => {
    if (typeof state === 'undefined') {
      state = this.defaultState;
    }

    return this._map.reduce(( prevState, mapping ) =>
        action instanceof mapping.action
          ? this.exec(mapping, prevState, action)
          : prevState,
      state
    );
  };

  private exec = ( mapping, state: S, action: Action ): S => {
    // TODO: Better way to determine whether this is a command execution or a delegate to reducer execution?

    switch (mapping.type) {
      case CommandType.PAYLOAD:
        return mapping.command(state, action.payload, action);
      case CommandType.DELEGATE:
        return mapping.command(state, action);
    }
  };
}
