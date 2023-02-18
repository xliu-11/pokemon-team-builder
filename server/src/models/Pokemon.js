const { Model } = require('objection');
const Team = require('./Team');

class Pokemon extends Model {
  static get tableName() {
    return 'pokemons';
  }

  static get relationMappings() {
    return {
      teams: {
        relation: Model.ManyToManyRelation,
        modelClass: Team,
        join: {
          from: 'pokemons.id',
          through: {
            from: 'pokemons_teams.pokemon_id',
            to: 'pokemons_teams.team_id'
          },
          to: 'teams.id'
        }
      }
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'type', 'image', 'abilities', 'stats'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        type: { type: 'string' },
        secondaryType: { type: ['string', 'null'] },
        image: { type: 'string' },
        abilities: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1
        },
        hiddenAbility: { type: ['string', 'null'] },
        stats: {
          type: 'array',
          items: {
            type: 'object',
            required: ['name', 'value'],
            properties: {
              name: { type: 'string' },
              value: { type: 'integer' }
            }
          },
          minItems: 6,
          maxItems: 6
        }
      }
    };
  }
}

module.exports = Pokemon;
