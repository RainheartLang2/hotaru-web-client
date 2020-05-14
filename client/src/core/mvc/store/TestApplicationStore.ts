import TypedApplicationStore, {Derivatives, SingleProperty} from "./TypedApplicationStore";
import {Field} from "./Field";

export default class TestApplicationStore extends TypedApplicationStore<State, Derivations> {
    protected getDefaultState(): State {
        return {
            testProperty: "",
            firstNumber: 0,
            secondNumber: 0,
        }
    }

    protected getDefaultDerivatives(): Derivatives<State, Derivations> {
        return {
            sum: {
                dependsOn: ['firstNumber', 'secondNumber'],
                get: (args: Pick<State, 'firstNumber' | 'secondNumber'>): number => args.firstNumber + args.secondNumber,
                value: 0,
            },
            testNumber: {
                dependsOn: ['firstNumber'],
                get: (args: Pick<State, 'firstNumber'>): number => args.firstNumber,
                value: 0,
            },
            nested: {
                dependsOn: ['firstNumber', 'sum'],
                get: (args: Pick<State & Derivations, 'firstNumber' | 'sum'>): number => args.firstNumber + args.sum,
                value: 0,
            },
            field: this.createField('testProperty', "")
        }
    }
}

export type State = {
    testProperty: string,
    firstNumber: number,
    secondNumber: number,
}

export type Derivations = {
    sum: number,
    testNumber: number,
    nested: number,
    field: Field,
}