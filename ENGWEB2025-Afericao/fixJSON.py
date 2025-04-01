import json
import ast

def fix_json_lists(json_data, fields_to_fix):
    for field in fields_to_fix:
        if field in json_data and isinstance(json_data[field], str):
            try:
                # Tenta converter a string para uma lista usando ast.literal_eval
                converted_value = ast.literal_eval(json_data[field])
                if isinstance(converted_value, list):
                    json_data[field] = converted_value
            except (SyntaxError, ValueError):
                pass  # Mantém o valor original se não for possível converter

    # Tratamento especial para o campo 'author'
    if "author" in json_data and isinstance(json_data["author"], str):
        # Divide a string de autores por vírgulas e remove espaços extras
        authors_list = [author.strip() for author in json_data["author"].split(",")]
        json_data["author"] = authors_list

    return json_data

# Lista dos campos que devem ser convertidos
fields_to_fix = [
    "genres", "characters", "awards", "ratingsByStars", "setting", "authors"
]

# Carregar o JSON do ficheiro
with open("data.json", "r", encoding="utf-8") as file:
    data = json.load(file)

# Aplicar a conversão
if isinstance(data, list):
    fixed_data = [fix_json_lists(item, fields_to_fix) for item in data]
elif isinstance(data, dict):
    fixed_data = fix_json_lists(data, fields_to_fix)
else:
    fixed_data = data  # Caso o JSON não seja uma lista ou dicionário

# Guardar o JSON corrigido
with open("fixed_data.json", "w", encoding="utf-8") as file:
    json.dump(fixed_data, file, indent=4, ensure_ascii=False)

print("Conversão concluída. Arquivo salvo como 'fixed_data.json'.")