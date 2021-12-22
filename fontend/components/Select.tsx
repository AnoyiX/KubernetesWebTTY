import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

interface ISelect {
  value: any;
  options: any[];
  onChange: (value: any) => void
  valueKey?: (value: any) => string
}

export default function Select({ value, options, onChange, valueKey }: ISelect) {

  return (
    <div className="w-full top-16">
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white min-h-min border rounded-lg cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
            <span className="block truncate">{valueKey ? valueKey(value) : value}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SelectorIcon
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white shadow-md rounded-md max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((item, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) => `${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'} cursor-default select-none relative py-2 pl-10 pr-4`}
                  value={item}
                >
                  {({ selected, active }) => (
                    <>
                      <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                        {valueKey ? valueKey(item) : item}
                      </span>
                      {selected ? (
                        <span className={`${active ? 'text-amber-600' : 'text-amber-600'} absolute inset-y-0 left-0 flex items-center pl-3`}>
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}
