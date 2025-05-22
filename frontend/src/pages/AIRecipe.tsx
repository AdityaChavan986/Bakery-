import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Lightbulb, Coffee, Sparkles } from 'lucide-react';

const AIRecipe: React.FC = () => {
  const [generating, setGenerating] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([
    'flour', 'sugar', 'butter'
  ]);
  const [newIngredient, setNewIngredient] = useState('');
  
  const handleAddIngredient = () => {
    if (newIngredient.trim() !== '') {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };
  
  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };
  
  const handleGenerateRecipe = () => {
    setGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setGenerating(false);
      setShowRecipe(true);
    }, 2000);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="AI Recipe Generator"
        subtitle="Let our AI create a unique recipe based on ingredients you have"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ingredients Selection */}
        <Card className="lg:col-span-1">
          <div className="p-4 border-b border-gray-100 flex items-center space-x-2">
            <Coffee size={20} className="text-primary-600" />
            <h3 className="font-serif text-xl font-semibold text-gray-800">Ingredients</h3>
          </div>
          <CardBody>
            <p className="text-gray-600 mb-4">
              Add the ingredients you have available, and our AI will create a custom recipe for you.
            </p>
            
            <div className="flex mb-4">
              <input
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                placeholder="Add an ingredient..."
                className="flex-grow rounded-l-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddIngredient();
                  }
                }}
              />
              <button
                onClick={handleAddIngredient}
                className="bg-primary-600 text-white px-4 py-2 rounded-r-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
              >
                Add
              </button>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Current Ingredients:</h4>
              {ingredients.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ingredient, index) => (
                    <div 
                      key={index} 
                      className="bg-primary-100 text-primary-800 rounded-full px-3 py-1 text-sm flex items-center"
                    >
                      {ingredient}
                      <button 
                        onClick={() => handleRemoveIngredient(index)} 
                        className="ml-1 text-primary-600 hover:text-primary-800 focus:outline-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No ingredients added yet.</p>
              )}
            </div>
            
            <Button
              variant="primary"
              fullWidth
              loading={generating}
              disabled={ingredients.length === 0 || generating}
              onClick={handleGenerateRecipe}
            >
              <Sparkles size={16} className="mr-2" />
              Generate Recipe
            </Button>
          </CardBody>
        </Card>
        
        {/* Recipe Display */}
        <Card className="lg:col-span-2">
          <div className="p-4 border-b border-gray-100 flex items-center space-x-2">
            <Lightbulb size={20} className="text-primary-600" />
            <h3 className="font-serif text-xl font-semibold text-gray-800">Generated Recipe</h3>
          </div>
          <CardBody>
            {showRecipe ? (
              <div>
                <h2 className="font-serif text-2xl font-bold mb-4 text-gray-800">Buttery Vanilla Shortbread Cookies</h2>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Ingredients:</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>2 cups all-purpose flour</li>
                    <li>1 cup unsalted butter, softened</li>
                    <li>1/2 cup granulated sugar</li>
                    <li>1/4 teaspoon salt</li>
                    <li>1 teaspoon vanilla extract</li>
                  </ul>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Instructions:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600">
                    <li>Preheat your oven to 325°F (165°C) and line a baking sheet with parchment paper.</li>
                    <li>In a large bowl, cream together the softened butter and sugar until light and fluffy.</li>
                    <li>Add the vanilla extract and mix well.</li>
                    <li>Gradually add the flour and salt, mixing until just combined. Be careful not to overmix.</li>
                    <li>Form the dough into a ball and roll it out on a lightly floured surface to about 1/4 inch thickness.</li>
                    <li>Cut into desired shapes using cookie cutters, or simply cut into squares or rectangles.</li>
                    <li>Place the cookies on the prepared baking sheet, leaving about 1 inch between each.</li>
                    <li>Bake for 15-18 minutes, or until the edges are just beginning to turn golden.</li>
                    <li>Allow the cookies to cool on the baking sheet for 5 minutes, then transfer to a wire rack to cool completely.</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Notes:</h3>
                  <p className="text-gray-600">
                    These shortbread cookies are perfect with a cup of tea or coffee. For a variation, you can add lemon zest, chocolate chips, or dip half of each cookie in melted chocolate after baking. Store in an airtight container for up to one week.
                  </p>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button variant="outline" onClick={() => setShowRecipe(false)}>
                    Reset
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={24} className="text-primary-600" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-gray-800 mb-2">Your Recipe Will Appear Here</h3>
                <p className="text-gray-500">
                  Add ingredients and click "Generate Recipe" to see an AI-created recipe based on what you have available.
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AIRecipe;