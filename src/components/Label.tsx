export const Label = ({children, type}: {children: string, type?: string}) => {
  switch (type) {
    case 'input':
      return (
        <label className="block text-gray-600 text-sm mb-2">
          {children}
        </label>
      )
    case 'input-content':
      return (
        <label className="block text-gray-700 text-md mb-2">
          {children}
        </label>
      )
    case 'title-1':
      return (
        <label className="text-gray-700 text-2xl font-semibold">
          {children}
        </label>
      )
    default:
      return (
        <label className="text-sm text-gray-500 mb-2">
          {children}
        </label>
      );
  }
}