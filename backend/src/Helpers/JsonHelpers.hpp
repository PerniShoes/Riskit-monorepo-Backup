
namespace JsonHelp
{
    template<typename T>
    T SafeGet(const nlohmann::json& jsonInput,const std::string& key,const T& defaultValue)
    {
        if (jsonInput.contains(key) && jsonInput[key].is_null() == false)
        {
            try
            {
                return jsonInput.at(key).get<T>();
            }
            catch (...)
            {
                return defaultValue;
            }
        }
        return defaultValue;
    }






}