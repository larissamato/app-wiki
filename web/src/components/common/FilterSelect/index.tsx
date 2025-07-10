import { Select } from "antd";
import { useTranslation } from "react-i18next";

const FilterSelect = ({ options, placeholderKey, mode = "multiple", optionRenderer, ...props }: { options: any[], placeholderKey: string, mode?: "multiple" | "tags", optionRenderer: (option: any) => JSX.Element, [key: string]: any }) => {
  const { t } = useTranslation();

  return (
    <Select
      showSearch
      allowClear
      filterOption={false}
      mode={mode}
      placeholder={t(placeholderKey)}
      style={{ width: '100%' }}
      {...props}
    >
      {options.map(optionRenderer)}
    </Select>
  );
};

export default FilterSelect;
